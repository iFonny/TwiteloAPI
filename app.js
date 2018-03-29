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
const RateLimit = require('express-rate-limit');
const hat = require('hat');
const deepFreeze = require('deep-freeze');
const moment = require('moment');
const glob = require('glob');
const jwt = require('jwt-simple');
const isBase64 = require('is-base64');
const base64Img = require('base64-img');
const MTwitter = require('mtwitter');
const Twitter = require('twitter');
const makeDir = require('make-dir');
// Set default lifetime to 60 seconds for all entries
const cache = require('express-redis-cache')({
    expire: 60,
    prefix: 'twitelo'
});
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
        routes: {}, // Look Routes (end of app.js)
        dbMethods: {}
    },
    tags: {} // by game
};
Server.moment.locale('fr');


//=======================================================================//
//     RethinkDB                                                         //
//=======================================================================//

global.r = require('rethinkdbdash')({
    db: config.db.name
});

// Check or create if needed tables doesn't exist
Server.fn.db.checkOrCreateTable();

/* Getting database functions in the /database/methods folder */
glob.sync(`${__dirname}/database/methods/*.js`).forEach((file) => {
    const methodName = path.basename(file, '.js');

    // Require database functions
    Server.fn.dbMethods[methodName] = require(file);
});

//=======================================================================//
//     Tags                                                           //
//=======================================================================//

/* Getting tags in the /tags folder */
glob.sync(`${__dirname}/tags/*.js`).forEach((file) => {
    const gameName = path.basename(file, '.js');

    // Require routes functions
    Server.tags[gameName] = require(`${__dirname}/tags/${gameName}`);
});

//=======================================================================//
//     Express                                                           //
//=======================================================================//

const app = express();
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
    __log(`API runining on port ${config.server.port} [**${config.env}**]`);
});

/* TODO: RATELIMIT A PENSER 
const apiLimiter = new RateLimit({
    windowMs: 60 * 1000,
    max: 5,
    delayAfter: 1,
    delayMs: 3 * 1000
});


var limiter = new RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 100 requests per windowMs
    delayMs: 0 // disable delaying - full speed until the max limit is reached
});

app.use(limiter); //  apply to all requests
*/

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

module.exports = app; // for testing