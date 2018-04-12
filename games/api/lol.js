/*
 ** Get & resolve game account info or ids
 **
 ** Params: 
 ** - settings (required: account settings)
 **
 ** Return (Promise): 
 ** - string: account infos in game
 **
 ** Reject error format : {
 **     code: 500,
 **     messsage: 'Can\'t get game account',
 **     full: error // full error
 ** }
 **
 */
module.exports.getAccountInfo = (gameID, settings) => {
    return new Promise((resolve, reject) => {

        Server.fn.game[gameID].getSummonerByName(settings.username, settings.region)
            .then((summoner) => {
                Server.fn.game.utils.useMeAfterEachRequest(Server.game[gameID], 1);

                if (summoner) resolve(summoner);
                else resolve(null);
            })
            .catch(error => reject({
                code: 500,
                message: 'Can\'t get game account',
                full: error
            }));

    });
};


/*
 ** Update database with new game data (no bulk account)
 **
 ** Params : 
 ** - game (required)
 ** - data_settings (required)
 ** - game_account_info (required)
 ** - tag_ids (required)
 **
 */
module.exports.getDataOneByOne = async (game, data_settings, game_account_info, tag_ids) => {

    // League tags
    if (tag_ids.LOL__RANKED_SOLO_SR__LEAGUE_NAME || tag_ids.LOL__RANKED_SOLO_SR__TIER ||
        tag_ids.LOL__RANKED_SOLO_SR__RANK || tag_ids.LOL__RANKED_SOLO_SR__LP ||
        tag_ids.LOL__RANKED_SOLO_SR__WINS || tag_ids.LOL__RANKED_SOLO_SR__LOSSES ||
        tag_ids.LOL__RANKED_SOLO_SR__WINRATE ||
        tag_ids.LOL__RANKED_FLEX_SR__LEAGUE_NAME || tag_ids.LOL__RANKED_FLEX_SR__TIER ||
        tag_ids.LOL__RANKED_FLEX_SR__RANK || tag_ids.LOL__RANKED_FLEX_SR__LP ||
        tag_ids.LOL__RANKED_FLEX_SR__WINS || tag_ids.LOL__RANKED_FLEX_SR__LOSSES ||
        tag_ids.LOL__RANKED_FLEX_SR__WINRATE ||
        tag_ids.LOL__RANKED_FLEX_TT__LEAGUE_NAME || tag_ids.LOL__RANKED_FLEX_TT__TIER ||
        tag_ids.LOL__RANKED_FLEX_TT__RANK || tag_ids.LOL__RANKED_FLEX_TT__LP ||
        tag_ids.LOL__RANKED_FLEX_TT__WINS || tag_ids.LOL__RANKED_FLEX_TT__LOSSES ||
        tag_ids.LOL__RANKED_FLEX_TT__WINRATE
    ) {
        await Server.fn.game.utils.useMeBeforeEachRequest(game);

        const res = await Server.fn.game[game.id].getLeaguePositionsBySummonerID(game_account_info.summoner_id, game_account_info.region);

        if (res.data) {

            // Update account username in database (namechange handler)
            if (res.data.username) Server.fn.game[game.id].updateDBAccountUsername(game_account_info, res.data.username);

            // Ranked Solo 5v5
            await Server.fn.game.utils.updateGameData(res.data.rankedSoloSR.leagueName, 'LOL__RANKED_SOLO_SR__LEAGUE_NAME', game.id, data_settings, game_account_info);
            await Server.fn.game.utils.updateGameData(res.data.rankedSoloSR.tier, 'LOL__RANKED_SOLO_SR__TIER', game.id, data_settings, game_account_info);
            await Server.fn.game.utils.updateGameData(res.data.rankedSoloSR.rank, 'LOL__RANKED_SOLO_SR__RANK', game.id, data_settings, game_account_info);
            await Server.fn.game.utils.updateGameData(res.data.rankedSoloSR.leaguePoints, 'LOL__RANKED_SOLO_SR__LP', game.id, data_settings, game_account_info);
            await Server.fn.game.utils.updateGameData(res.data.rankedSoloSR.wins, 'LOL__RANKED_SOLO_SR__WINS', game.id, data_settings, game_account_info);
            await Server.fn.game.utils.updateGameData(res.data.rankedSoloSR.losses, 'LOL__RANKED_SOLO_SR__LOSSES', game.id, data_settings, game_account_info);
            await Server.fn.game.utils.updateGameData(res.data.rankedSoloSR.winrate, 'LOL__RANKED_SOLO_SR__WINRATE', game.id, data_settings, game_account_info);

            // Ranked Flex 5v5
            await Server.fn.game.utils.updateGameData(res.data.rankedFlexSR.leagueName, 'LOL__RANKED_FLEX_SR__LEAGUE_NAME', game.id, data_settings, game_account_info);
            await Server.fn.game.utils.updateGameData(res.data.rankedFlexSR.tier, 'LOL__RANKED_FLEX_SR__TIER', game.id, data_settings, game_account_info);
            await Server.fn.game.utils.updateGameData(res.data.rankedFlexSR.rank, 'LOL__RANKED_FLEX_SR__RANK', game.id, data_settings, game_account_info);
            await Server.fn.game.utils.updateGameData(res.data.rankedFlexSR.leaguePoints, 'LOL__RANKED_FLEX_SR__LP', game.id, data_settings, game_account_info);
            await Server.fn.game.utils.updateGameData(res.data.rankedFlexSR.wins, 'LOL__RANKED_FLEX_SR__WINS', game.id, data_settings, game_account_info);
            await Server.fn.game.utils.updateGameData(res.data.rankedFlexSR.losses, 'LOL__RANKED_FLEX_SR__LOSSES', game.id, data_settings, game_account_info);
            await Server.fn.game.utils.updateGameData(res.data.rankedFlexSR.winrate, 'LOL__RANKED_FLEX_SR__WINRATE', game.id, data_settings, game_account_info);

            // Ranked Flex 3v3
            await Server.fn.game.utils.updateGameData(res.data.rankedFlexTT.leagueName, 'LOL__RANKED_FLEX_TT__LEAGUE_NAME', game.id, data_settings, game_account_info);
            await Server.fn.game.utils.updateGameData(res.data.rankedFlexTT.tier, 'LOL__RANKED_FLEX_TT__TIER', game.id, data_settings, game_account_info);
            await Server.fn.game.utils.updateGameData(res.data.rankedFlexTT.rank, 'LOL__RANKED_FLEX_TT__RANK', game.id, data_settings, game_account_info);
            await Server.fn.game.utils.updateGameData(res.data.rankedFlexTT.leaguePoints, 'LOL__RANKED_FLEX_TT__LP', game.id, data_settings, game_account_info);
            await Server.fn.game.utils.updateGameData(res.data.rankedFlexTT.wins, 'LOL__RANKED_FLEX_TT__WINS', game.id, data_settings, game_account_info);
            await Server.fn.game.utils.updateGameData(res.data.rankedFlexTT.losses, 'LOL__RANKED_FLEX_TT__LOSSES', game.id, data_settings, game_account_info);
            await Server.fn.game.utils.updateGameData(res.data.rankedFlexTT.winrate, 'LOL__RANKED_FLEX_TT__WINRATE', game.id, data_settings, game_account_info);
        }

        Server.fn.game.utils.useMeAfterEachRequest(game, res.requests);
    }

};

/*
 ** Update database with new game data
 **
 ** Params : 
 ** - game (required)
 ** - tags (required): Array of tags (reduced and modified with only useful informations)
 ** example: 
 ** [{ 
 **     game_id: 'lol',
 **     data_settings: null,
 **     game_account_info: { 
 **         account_id: '204805322',
 **         region: 'br',
 **         summoner_id: '46741395'
 **     },
 **     tag_ids: {
 **         LOL__RANKED_SOLO_SR__RANK: true,
 **         LOL__RANKED_SOLO_SR__TIER: true
 **     } 
 ** }]
 **
 ** Return (Promise): recap
 **
 */

module.exports.updateFullGameData = (game, tags) => {
    return new Promise(async (resolve) => {

        const time = process.hrtime();
        __log(`__**${game.name}**__ - starting update...`);

        for (const {
                data_settings,
                game_account_info,
                tag_ids
            } of tags) {

            await Server.gameAPI[game.id].getDataOneByOne(game, data_settings, game_account_info, tag_ids);

        }
        const elapsedTimeS = process.hrtime(time)[0];
        const elapsedTimeMS = process.hrtime(time)[1] / 1000000;

        __log(`__**${game.name}**__ - update finished in **${elapsedTimeS}s ${elapsedTimeMS}ms**`);
        __logRecapGame(`__**${game.name}**__ - **${Server.ratelimitCounters[game.id].totalTags}** tags updated for a total of **${Server.ratelimitCounters[game.id].totalRequests}** requests in **${elapsedTimeS}s**.`);
        return resolve(`${game.name} - ${Server.ratelimitCounters[game.id].totalTags} tags updated for a total of ${Server.ratelimitCounters[game.id].totalRequests} requests in ${elapsedTimeS}s.`);
    });
};




//=======================================================================//
//     GENERATOR                                                         //
//=======================================================================//

// User to generate a new formated data with settings
module.exports.generator = {
    tier(gameTag, data, settings) {
        let result = data;

        for (const key of gameTag.settingsOrder) {
            const setting = settings[key];

            switch (key) {
                case 'size':
                    result = gameTag.data[key][setting](result.toUpperCase()) || result;
                    break;
                case 'format':
                    result = gameTag.data[key][setting](result) || result;
                    break;

                default:
                    break;
            }
        }

        return result;
    },
    rank(gameTag, data, settings) {
        let result = data;

        for (const key of gameTag.settingsOrder) {
            const setting = settings[key];

            switch (key) {
                case 'format':
                    result = gameTag.data[key][setting](result) || result;
                    break;

                default:
                    break;
            }
        }

        return result;
    }
};