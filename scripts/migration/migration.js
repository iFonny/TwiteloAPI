// Config
const config = require('./secret.json');

// Modules
const mysql = require('mysql');
const fs = require('fs');
//const util = require('util');
const jwt = require('jwt-simple');
const Twitter = require('twit');
const hat = require('hat');
const {
    Kayn
} = require('kayn');
const kayn = Kayn(config.lolApiKey)();
const r = require('rethinkdbdash')({
    db: config.dbName
});


// Connect SQL
const connection = mysql.createConnection(config.mysql);
connection.connect();

let updatedUsers = [];
let erroredUsers = [];

// Get old users and settings
connection.query('SELECT * FROM bio_users WHERE enable = 1', async (error, users) => {
    if (error) throw error;
    connection.query('SELECT * FROM bio_settings', async (error, settings) => {
        if (error) throw error;

        // Create objects with old user && settings
        users = users.map(user => {
            return {
                user: user,
                settings: settings.find(setting => setting.id == user.id_twitter)
            };
        });
        
        const total = users.length;
        let counter = 0;

        for (let oldUser of users) {

            let newUser = await getNewTwitterUser(oldUser.user);
            if (newUser) {

                try {
                    newUser = await r.table('user').insert(newUser, {
                        returnChanges: 'always'
                    }).run().then((result) => result.changes[0].new_val);

                    if (newUser) {
                        let newGameAccount = await getGameAccount(oldUser.settings, newUser.id);
                        let mapUserTags = getIncludedTagsFromText(newUser.twitelo.description.content);

                        if (newGameAccount) {
                            newGameAccount = await r.table('account').insert(newGameAccount, {
                                returnChanges: 'always'
                            }).run().then((result) => result.changes[0].new_val);

                            if (newGameAccount) {
                                for (const oldTag in mapUserTags) {
                                    mapUserTags[oldTag] = await getNewTag(newGameAccount, oldTag);
                                }
                            }
                        }

                        // Replace tags
                        if (Object.keys(mapUserTags).length > 0) {
                            var re = new RegExp(Object.keys(mapUserTags).join('|').replace(/{/g, '\\{'), 'g');
                            newUser.twitelo.description.content = newUser.twitelo.description.content.replace(re, (matched) => mapUserTags[matched]);
                        }

                        // Update desc + activate switch
                        await r.table('user').filter({
                            id: newUser.id
                        }).update({
                            switch: true,
                            twitelo: {
                                description: {
                                    content: newUser.twitelo.description.content
                                }
                            }
                        }).run();

                        updatedUsers.push(oldUser.user.username);
                        console.log(`SUCCESS : USER @${oldUser.user.username} CREATED ${counter}/${total}`);
                    } else errorUser(oldUser.user.username, 'newUser empty');

                } catch (error) {
                    errorUser(oldUser.user.username, 'db error', error);
                }
            }

            counter += 1;
        }

        console.log('Success: ', updatedUsers);
        console.log('Errors: ', erroredUsers);

        console.log(erroredUsers.map(user => user.usernameOrGameName));

        try {
            fs.writeFileSync('./results/success.json', JSON.stringify(updatedUsers));
            console.log('Success file has been created.');
        } catch (error) {
            console.error(error);
        }
        try {
            fs.writeFileSync('./results/errors.json', JSON.stringify(erroredUsers));
            console.log('Errors file has been created.');
        } catch (error) {
            console.error(error);
        }

        console.log(`End of migration | success: ${updatedUsers.length} | errors: ${erroredUsers.length}`);
        process.exit();

    });
});

function errorUser(usernameOrGameName, from, error) {
    erroredUsers.push({
        usernameOrGameName,
        from,
        error: error || null
    });
    console.log(`ERROR : USER @${usernameOrGameName} NOT UPDATED`);
    return null;
}

function getNewTag(newGameAccount, oldTag) {
    return new Promise((resolve) => {
        let newTag = {
            account_id: newGameAccount.id,
            created: Date.now() - (10 * 60000),
            data: null,
            data_settings: {},
            game_account_info: newGameAccount.game_account_info,
            game_id: 'lol',
            included: true,
            updated: Date.now() - (10 * 60000),
            user_id: newGameAccount.user_id
        };

        switch (oldTag) {
            case '<{LOL_SOLO_TIER}>':
                newTag.tag_id = 'LOL__RANKED_SOLO_SR__TIER';
                newTag.size = 10;
                newTag.settings = {
                    format: 'default',
                    size: 'default'
                };
                break;
            case '<{LOL_SOLO_DIVISION}>':
                newTag.tag_id = 'LOL__RANKED_SOLO_SR__RANK';
                newTag.size = 3;
                newTag.settings = {
                    format: 'default'
                };
                break;
            case '<{LOL_SOLO_LP}>':
                newTag.tag_id = 'LOL__RANKED_SOLO_SR__LP';
                newTag.size = 3;
                newTag.settings = {
                    format: 'default',
                    size: 'default'
                };
                break;
            case '<{LOL_SOLO_WINRATE}>':
                newTag.tag_id = 'LOL__RANKED_SOLO_SR__WINRATE';
                newTag.size = 4;
                newTag.settings = {
                    size: 'withPercentNoSpace'
                };
                break;
            case '<{LOL_FLEX_TIER}>':
                newTag.tag_id = 'LOL__RANKED_FLEX_SR__TIER';
                newTag.size = 10;
                newTag.settings = {
                    format: 'default',
                    size: 'default'
                };
                break;
            case '<{LOL_FLEX_DIVISION}>':
                newTag.tag_id = 'LOL__RANKED_FLEX_SR__RANK';
                newTag.size = 3;
                newTag.settings = {
                    format: 'default'
                };
                break;
            case '<{LOL_FLEX_LP}>':
                newTag.tag_id = 'LOL__RANKED_FLEX_SR__LP';
                newTag.size = 3;
                newTag.settings = {
                    format: 'default',
                    size: 'default'
                };
                break;
            case '<{LOL_FLEX_WINRATE}>':
                newTag.tag_id = 'LOL__RANKED_FLEX_SR__WINRATE';
                newTag.size = 4;
                newTag.settings = {
                    size: 'withPercentNoSpace'
                };
                break;
            case '<{LOL_3V3_TIER}>':
                newTag.tag_id = 'LOL__RANKED_FLEX_TT__TIER';
                newTag.size = 10;
                newTag.settings = {
                    format: 'default',
                    size: 'default'
                };
                break;
            case '<{LOL_3V3_DIVISION}>':
                newTag.tag_id = 'LOL__RANKED_FLEX_TT__RANK';
                newTag.size = 3;
                newTag.settings = {
                    format: 'default'
                };
                break;
            case '<{LOL_3V3_LP}>':
                newTag.tag_id = 'LOL__RANKED_FLEX_TT__LP';
                newTag.size = 3;
                newTag.settings = {
                    format: 'default',
                    size: 'default'
                };
                break;
            case '<{LOL_3V3_WINRATE}>':
                newTag.tag_id = 'LOL__RANKED_FLEX_TT__WINRATE';
                newTag.size = 4;
                newTag.settings = {
                    size: 'withPercentNoSpace'
                };
                break;
            case '<{LOL_USERNAME}>':
                newTag.tag_id = 'LOL__ACCOUNT__USERNAME';
                newTag.size = 16;
                newTag.settings = {
                    format: 'default'
                };
                break;
            case '<{LOL_REGION}>':
                newTag.tag_id = 'LOL__ACCOUNT__REGION';
                newTag.size = 4;
                newTag.settings = {
                    format: 'default',
                    size: 'default'
                };
                break;
            default:
                return resolve('');
        }

        r.table('tag').insert(newTag, {
                returnChanges: 'always'
            }).run()
            .then((result) => result.changes[0].new_val)
            .then(tag => resolve(`<{${tag.id}}>`))
            .catch((error) => resolve(errorUser(newGameAccount.game_account_info.gamename, 'getNewTag', error)));
    });
}

function getIncludedTagsFromText(text) {
    let includedTags = {};
    const myRegexp = /(<{[^<>{} ]+?}>)/g;
    let match = myRegexp.exec(text);

    while (match != null) {
        includedTags[match[1]] = '';
        match = myRegexp.exec(text);
    }
    return includedTags;
}

function getGameAccount(oldSettings, userID) {
    return new Promise((resolve) => {
        if (oldSettings && parseInt(oldSettings.gameid, 10) && oldSettings.region) {
            kayn.Summoner.by.id(parseInt(oldSettings.gameid, 10))
                .region(oldSettings.region.toLowerCase())
                .then((summoner) => {
                    resolve({
                        created: Date.now(),
                        game_account_info: {
                            summoner_id: summoner.id,
                            account_id: summoner.accountId,
                            region: oldSettings.region.toLowerCase()
                        },
                        game_id: 'lol',
                        included: false,
                        settings: {
                            region: oldSettings.region.toLowerCase(),
                            username: oldSettings.gamename
                        },
                        user_id: userID,
                        verified: false
                    });
                    resolve({
                        summoner_id: summoner.id,
                        account_id: summoner.accountId,
                        region: oldSettings.region.toLowerCase()
                    });
                })
                .catch((error) => resolve(errorUser(oldSettings.gamename, 'getGameAccount', error)));
        } else resolve(null);
    });
}

function getNewTwitterUser(oldUser) {
    return new Promise((resolve) => {

        // Decode twitter tokens 
        const twitterTokens = jwt.decode(oldUser.twitterTokens, config.oldJwtSecret);
        var client = new Twitter({
            consumer_key: config.twitterConsumerKey,
            consumer_secret: config.twitterConsumerSecret,
            access_token: twitterTokens.oauthAccessToken,
            access_token_secret: twitterTokens.oauthAccessTokenSecret
        });

        client.get('account/verify_credentials', {
            skip_status: true
        }, (error, twUser) => {
            if (!error) {
                let newUser = {
                    role: 'USER',
                    twitter_id: twUser.id_str,
                    twitelo_token: `${hat(16)}${twUser.id_str}-${hat(256)}`,
                    api_key: `${hat(16)}${twUser.id_str}-${hat(256)}`,
                    tokens: jwt.encode({
                        token: twitterTokens.oauthAccessToken,
                        tokenSecret: twitterTokens.oauthAccessTokenSecret,
                        id: twUser.id_str
                    }, config.jwtSecret),
                    username: twUser.screen_name,
                    name: twUser.name,
                    protected: twUser.protected,
                    verified: twUser.verified,
                    followers: twUser.followers_count,
                    lang: twUser.lang.toLowerCase(),
                    profile_image_url: twUser.profile_image_url_https.replace('_normal', '_400x400'),
                    description: twUser.description,
                    switch: false,
                    freshUser: false,
                    disabled: 0,
                    settings: {
                        locale: twUser.lang.toLowerCase() == 'fr' ? 'fr' : 'en',
                        notifications: {
                            mp_twitter: true
                        },
                        pp_trigger: false
                    },
                    twitelo: {
                        name: {
                            status: false,
                            content: twUser.name || ''
                        },
                        description: {
                            status: true,
                            content: oldUser.bio_twitter
                        },
                        location: {
                            status: false,
                            content: twUser.location || ''
                        }
                    },
                    created: Date.now(),
                    updated: Date.now()
                };
                resolve(newUser);
            } else resolve(errorUser(oldUser.username, 'getNewTwitterUser', error));
        });
    });
}