//=======================================================================//
//     Node packages                                                     //
//=======================================================================//

const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
const favicon = require('serve-favicon');
const hat = require('hat');
const deepFreeze = require('deep-freeze');
const moment = require('moment');
const glob = require('glob');
const jwt = require('jwt-simple');
const isBase64 = require('is-base64');
const base64Img = require('base64-img');
const MTwitter = require('mtwitter');
const Twitter = require('twitter');
const TwitterUpdater = require('./functions/class/TwitterUpdater');
const makeDir = require('make-dir');
// Set default lifetime to 60 seconds for all entries
const cache = require('express-redis-cache')({
    expire: 60,
    prefix: 'twitelo'
});
const redisClient = require('redis').createClient();
global._ = require('lodash');

//=======================================================================//
//     Configs                                                           //
//=======================================================================//

// Get config (dev | prod)
global.config = deepFreeze(require('./configs/cursor'));

/* Logs init */
require('./functions/utils/logs').initLogs();

global.Server = {
    fs,
    hat,
    jwt,
    cache,
    makeDir,
    moment,
    Twitter,
    base64: {
        isBase64,
        utils: base64Img
    },
    twitterAPI: new MTwitter({ // Twitter API no-account
        consumer_key: config.secret.twitter.consumerKey,
        consumer_secret: config.secret.twitter.consumerSecret,
        application_only: true
    }),
    twitterBot: new Twitter({
        consumer_key: config.secret.twitter.consumerKey,
        consumer_secret: config.secret.twitter.consumerSecret,
        access_token_key: config.secret.twitter.twiteloAccessToken,
        access_token_secret: config.secret.twitter.twiteloAccessTokenSecret
    }),
    fn: {
        error: require('./functions/utils/error'),
        api: require('./functions/utils/api'),
        db: require('./functions/utils/db'),
        game: {}, // game functions
        routes: {}, // Look Routes (end of app.js)
        dbMethods: {}
    },
    limiter: null, // rate limiter
    game: {}, // by game
    gameAPI: {}, // by game
    gameTags: {}, // by game
    gameSettings: {}, // by game
    ratelimitCounters: {} // by game
};
Server.moment.locale('fr');


//=======================================================================//
//     RethinkDB                                                         //
//=======================================================================//

global.r = require('rethinkdbdash')({
    db: config.db.name
});

/* Getting database functions in the /database/methods folder */
glob.sync(`${__dirname}/database/methods/*.js`).forEach((file) => {
    const methodName = path.basename(file, '.js');

    // Require database functions
    Server.fn.dbMethods[methodName] = require(file);
});

const app = express();

// Check or create if needed tables doesn't exist
Server.fn.db.checkOrCreateTable().then(() => {

    //=======================================================================//
    //     Game, tag, settings, api                                          //
    //=======================================================================//

    glob.sync(`${__dirname}/games/*.js`).forEach((file) => {
        const gameName = path.basename(file, '.js');

        // global ratelimit counter
        Server.ratelimitCounters[gameName] = {
            reqCounter: 0,
            totalRequests: 0,
            totalTags: 0
        };
        // Require game in /games folder
        Server.game[gameName] = require(`${__dirname}/games/${gameName}`);
        // Require game tags in /games/tags folder
        Server.gameTags[gameName] = require(`${__dirname}/games/tags/${gameName}`);
        // Require game account settings in /games/settings folder
        Server.gameSettings[gameName] = require(`${__dirname}/games/settings/${gameName}`);
        // Require game methods in /games/api folder
        Server.gameAPI[gameName] = require(`${__dirname}/games/api/${gameName}`);
    });

    //=======================================================================//
    //     Games api functions                                               //
    //=======================================================================//

    /* Getting games functions in the /games/functions folder */
    glob.sync(`${__dirname}/games/functions/*.js`).forEach((file) => {
        const name = path.basename(file, '.js');

        // Require games api functions
        Server.fn.game[name] = require(`${__dirname}/games/functions/${name}`);
    });

    //=======================================================================//
    //     Express                                                           //
    //=======================================================================//

    app.use(compression());

    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    app.options('/*', (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        res.sendStatus(200);
    });

    app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
    app.use('/public/images', express.static(`${__dirname}/public/images`));
    app.use('/public/media', express.static(`${__dirname}/public/media/${config.env}`));

    app.enable('trust proxy');
    app.disable('x-powered-by');
    app.use(helmet());
    app.use(bodyParser.json({
        limit: '2mb'
    }));
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: '2mb'
    }));

    // create a write stream (in append mode)
    const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), {
        flags: 'a'
    });

    // setup the logger
    app.use(morgan('combined', {
        stream: accessLogStream
    }));


    app.listen(config.server.port, () => {
        __logInfo(`Server is listening on ${config.server.host}:${config.server.port} [**${config.env}**]`);
    });

    /* Rate limiter */
    Server.limiter = require('express-limiter')(app, redisClient);

    Server.limiter({
        path: '*',
        method: 'all',
        lookup: ['connection.remoteAddress'],
        // 150 requests per 5min
        total: 150,
        expire: 1000 * 60 * 5
    });

    //=======================================================================//
    //     Routes          		                                             //
    //=======================================================================//

    let routes = {};

    /* Getting routes in the /routes folder */
    glob.sync(`${__dirname}/routes/*.js`).forEach((file) => {
        const routeName = path.basename(file, '.js');

        // Save routes
        routes[routeName] = require(file).router(express, routeName);

        // Require routes functions
        Server.fn.routes[routeName] = require(`${__dirname}/functions/routes/${routeName}`);

        // Use routes
        app.use(`/${routeName}`, routes[routeName]);
    });

    /* Other routes */

    app.all('*', Server.fn.error.page404);


    //=======================================================================//
    //     Updaters                                                          //
    //=======================================================================//

    // Wait 10s before starting updaters
    setTimeout(() => {


        //=======================================================================//
        //     Game data updater                                                 //
        //=======================================================================//

        function gameUpdater(game) {
            Server.fn.api.getAndUpdateGameData(game).then(() => setTimeout(() => gameUpdater(game), 60 * 1000)); // 1 minute
        }

        gameUpdater(Server.game['lol']);

        /*for (const gameID in Server.game) {
            gameUpdater(Server.game[gameID]);
        }*/


        //=======================================================================//
        //     Twitter updater                                                   //
        //=======================================================================//

        const twitterUpdater = new TwitterUpdater();

        function twUpdater() {
            twitterUpdater.update().then(() => setTimeout(() => twUpdater(), 60 * 1000)); // 1 minute
        }

        //twUpdater();


    }, 0 * 1000); // 10s



});

module.exports = app; // for testing