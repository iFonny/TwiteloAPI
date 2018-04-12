//=======================================================================//
//     Config game lib                                                   //
//=======================================================================//

const {
    Kayn,
    RedisCache
} = require('kayn');
const xregexp = require('xregexp');

const redisCache = new RedisCache();

const kayn = Kayn(config.secret.game.lol.apiKey)({
    region: 'euw',
    debugOptions: {
        isEnabled: true,
        showKey: false,
    },
    requestOptions: {
        shouldRetry: true,
        numberOfRetriesBeforeAbort: 2,
        delayBeforeRetry: 1000,
        burst: true,
    },
    cacheOptions: {
        cache: redisCache,
        timeToLives: {
            useDefault: true,
            byGroup: {
                THIRD_PARTY_CODE: 0, // no cache
                CHAMPION_MASTERY: Server.game.lol.ratelimit.total, // cache for 5min
                LEAGUE: Server.game.lol.ratelimit.total, // cache for 5min
                LOL_STATUS: Server.game.lol.ratelimit.total, // cache for 5min
                MATCH: Server.game.lol.ratelimit.total, // cache for 5min
                SPECTATOR: Server.game.lol.ratelimit.total, // cache for 5min
                SUMMONER: Server.game.lol.ratelimit.total, // cache for 5min
                TOURNAMENT_STUB: Server.game.lol.ratelimit.total, // cache for 5min
                TOURNAMENT: Server.game.lol.ratelimit.total, // cache for 5min
                STATIC: 1000 * 60 * 60 * 24 * 7, // cache for a week
                CHAMPION: 1000 * 60 * 60 * 24 * 7, // cache for a week
            }
        },
    },
});

//=======================================================================//
//     Game utils functions                                              //
//=======================================================================//

module.exports = {

    getSummonerByName(username, region) {
        return new Promise((resolve, reject) => {

            const usernameRegex = xregexp('^[0-9\\pL _.]+$');

            if (usernameRegex.test(username) && username.length <= 16) {

                kayn.Summoner.by.name(username)
                    .region(region.toLowerCase())
                    .then((summoner) => {
                        resolve({
                            summoner_id: summoner.id,
                            account_id: summoner.accountId,
                            region: region.toLowerCase()
                        });
                    })
                    .catch((error) => {
                        if (error.statusCode == 404) resolve(null); // Doesn't exist
                        else reject(error);
                    });
            } else resolve(null); // Invalid or too long

        });
    },

    updateDBAccountUsername(game_account_info, username) {
        Server.fn.dbMethods.account.updateWithFilter({
                game_account_info
            }, {
                settings: {
                    username
                }
            }).then((result) => console.log(result))
            .catch((error) => __logError('[DB] Can\'t update account', error));
    },

    fonctionCoolQuiRecupereDesChoses: (summonerID, region) => {
        return new Promise((resolve) => {

            //console.log(kayn.config.cacheOptions);

            let data = {
                username: null,
                rankedFlexTT: {
                    leagueName: null,
                    tier: 'UNRANKED',
                    rank: null,
                    leaguePoints: null,
                    wins: null,
                    losses: null,
                    winrate: null
                },
                rankedSoloSR: {
                    leagueName: null,
                    tier: 'UNRANKED',
                    rank: null,
                    leaguePoints: null,
                    wins: null,
                    losses: null,
                    winrate: null
                },
                rankedFlexSR: {
                    leagueName: null,
                    tier: 'UNRANKED',
                    rank: null,
                    leaguePoints: null,
                    wins: null,
                    losses: null,
                    winrate: null
                }
            };

            /* 
                        const res = [{
                                "queueType": "RANKED_FLEX_TT",
                                "hotStreak": false,
                                "miniSeries": {
                                    "wins": 0,
                                    "losses": 0,
                                    "target": 3,
                                    "progress": "NNNNN"
                                },
                                "wins": 20,
                                "veteran": false,
                                "losses": 8,
                                "playerOrTeamId": "21705348",
                                "leagueName": "Zyra's Warlocks",
                                "playerOrTeamName": "Jihad Jayce",
                                "inactive": false,
                                "rank": "I",
                                "freshBlood": false,
                                "leagueId": "8cbf8150-1e39-11e8-94d7-c81f66dacb22",
                                "tier": "GOLD",
                                "leaguePoints": 100
                            },
                            {
                                "queueType": "RANKED_SOLO_5x5",
                                "hotStreak": false,
                                "wins": 74,
                                "veteran": false,
                                "losses": 65,
                                "playerOrTeamId": "21705348",
                                "leagueName": "Pantheon's Masterminds",
                                "playerOrTeamName": "Jihad Jayce",
                                "inactive": false,
                                "rank": "III",
                                "freshBlood": false,
                                "leagueId": "fca9e9a0-1269-11e8-bc14-c81f66db01ef",
                                "tier": "DIAMOND",
                                "leaguePoints": 52
                            },
                            {
                                "queueType": "RANKED_FLEX_SR",
                                "hotStreak": false,
                                "wins": 29,
                                "veteran": false,
                                "losses": 19,
                                "playerOrTeamId": "21705348",
                                "leagueName": "Skarner's Warriors",
                                "playerOrTeamName": "Jihad Jayce",
                                "inactive": false,
                                "rank": "IV",
                                "freshBlood": true,
                                "leagueId": "3c4c6310-35b2-11e8-802e-c81f66dacb22",
                                "tier": "DIAMOND",
                                "leaguePoints": 11
                            }
                        ];

             */
            data.username = 'Jihad Jayce';



            setTimeout(() => {
                resolve({
                    requests: 1,
                    data: {
                        username: 'Jihad Jayce',
                        rankedFlexTT: {
                            leagueName: 'Zyra\'s Warlocks',
                            tier: 'GOLD',
                            rank: 'I',
                            leaguePoints: 100,
                            wins: 20,
                            losses: 8,
                            winrate: 20 / (20 + 8) * 100,
                        },
                        rankedSoloSR: {
                            leagueName: 'Zyra\'s Warlocks',
                            tier: 'DIAMOND',
                            rank: 'II',
                            leaguePoints: 100,
                            wins: 20,
                            losses: 8,
                            winrate: 20 / (20 + 8) * 100
                        },
                        rankedFlexSR: {
                            leagueName: 'Zyra\'s Warlocks',
                            tier: 'GOLD',
                            rank: 'I',
                            leaguePoints: 100,
                            wins: 20,
                            losses: 8,
                            winrate: 20 / (20 + 8) * 100
                        }
                    }
                });
            }, 1000);


            // TODO: Resolve data null if error
            // TODO:  else Resolve data

        });
    }

};