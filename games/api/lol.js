/*
 ** Get & resolve game account info or ids
 **
 ** Params: 
 ** - settings (required: account settings)
 **
 ** Return (Promise): 
 ** - string: account infos in game
 */
module.exports.getAccountInfo = (gameID, settings) => {
    return new Promise((resolve, reject) => {


        // IMPORTANT : Server.fn.game.utils.useMeAfterEachRequest(Server.game[gameID], res.requests);

        // TODO
        resolve({
            summoner_id: '46741395',
            account_id: '204805322',
            region: settings.region
        });

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

    // If one of this tag -> update data
    if (tag_ids.LOL__RANKED_SOLO_SR__TIER || tag_ids.LOL__RANKED_SOLO_SR__RANK || tag_ids.LOL__RANKED_SOLO_SR__LP) {
        await Server.fn.game.utils.useMeBeforeEachRequest(game);

        const res = await Server.fn.game[game.id].fonctionCoolQuiRecupereDesChoses(game_account_info.summoner_id, game_account_info.region);

        if (res.data) {
            await Server.fn.game.utils.updateGameData(res.data.rankedSoloSR.tier, 'LOL__RANKED_SOLO_SR__TIER', game.id, data_settings, game_account_info);
            await Server.fn.game.utils.updateGameData(res.data.rankedSoloSR.rank, 'LOL__RANKED_SOLO_SR__RANK', game.id, data_settings, game_account_info);
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
        __logRecap(`__**${game.name}**__ - **${Server.ratelimitCounters[game.id].totalTags}** tags updated for a total of **${Server.ratelimitCounters[game.id].totalRequests}** requests in **${elapsedTimeS}s**.`);
        return resolve(`${game.name} - ${Server.ratelimitCounters[game.id].totalTags} tags updated for a total of ${Server.ratelimitCounters[game.id].totalRequests} requests in ${elapsedTimeS}s.`);
    });
};




//=======================================================================//
//     GENERATOR                                                         //
//=======================================================================//

module.exports.generator = {
    tier(gameTag, data, settings) {
        let result = data;

        for (const key of gameTag.settingsOrder) {
            const setting = settings[key];

            switch (key) {
                case 'size':
                    result = gameTag.data[key][setting][result.toUpperCase()] || result;
                    break;
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