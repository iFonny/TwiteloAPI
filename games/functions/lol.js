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
                        else reject(error); // Unknown error/bad region... 
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
        }).catch((error) => __logError('[DB] Can\'t update account', error));
    },

    async getLeaguePositionsBySummonerID(summonerID, region) {

        // Default values
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

        // Get summoner positions
        const positions = await kayn.LeaguePositions.by.summonerID(parseInt(summonerID, 10))
            .region(region.toLowerCase()).then()
            .catch((error) => (data = null, __logError('[GAME] getLeaguePositionsBySummonerID() error', error)));

        if (data) { // If no errors

            // QueueTypes map
            let queueTypes = {
                'RANKED_SOLO_5x5': 'rankedSoloSR',
                'RANKED_FLEX_SR': 'rankedFlexSR',
                'RANKED_FLEX_TT': 'rankedFlexTT',
            };

            // Add summoner positions in data
            for (const position of positions) {
                const queueType = queueTypes[position.queueType];

                if (queueType) {
                    data.username = position.playerOrTeamName;
                    data[queueType].leagueName = position.leagueName;
                    data[queueType].tier = position.tier;
                    data[queueType].rank = position.rank;
                    data[queueType].leaguePoints = position.leaguePoints;
                    data[queueType].wins = position.wins;
                    data[queueType].losses = position.losses;
                    data[queueType].winrate = Math.round(position.wins / (position.wins + position.losses) * 100);
                }
            }
        }

        return {
            requests: 1,
            data
        };
    }

};