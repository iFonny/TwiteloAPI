/*
 ** Get & resolve game account info or ids
 **
 ** Params: 
 ** - settings (required: account settings)
 **
 ** Return (Promise): 
 ** - string: account infos in game
 */
module.exports.getAccountInfo = (settings) => {
    return new Promise((resolve, reject) => {

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
 ** - counters (required): counter for ratelimit & stats
 ** - game (required)
 ** - data_settings (required)
 ** - game_account_info (required)
 ** - tag_ids (required)
 **
 */
module.exports.getDataOneByOne = async (counters, game, data_settings, game_account_info, tag_ids) => {

    // If one of this tag -> update data
    if (tag_ids.LOL__RANKED_SOLO_SR__TIER || tag_ids.LOL__RANKED_SOLO_SR__RANK || tag_ids.LOL__RANKED_SOLO_SR__LP) {
        await Server.fn.game.utils.useMeBeforeEachRequest(game.ratelimit, counters);

        const res = await Server.fn.game[game.id].fonctionCoolQuiRecupereDesChoses(game_account_info.summoner_id, game_account_info.region);

        if (res.data) {
            await Server.fn.game.utils.updateGameData(res.data.rankedSoloSR.tier, 'LOL__RANKED_SOLO_SR__TIER', game.id, data_settings, game_account_info, counters);
            await Server.fn.game.utils.updateGameData(res.data.rankedSoloSR.rank, 'LOL__RANKED_SOLO_SR__RANK', game.id, data_settings, game_account_info, counters);
        }

        Server.fn.game.utils.useMeAfterEachRequest(counters, res.requests);
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

module.exports.updateGameData = (game, tags) => {
    return new Promise(async (resolve) => {

        let counters = {
            reqCounter: 0,
            totalRequests: 0,
            totalTags: 0
        };
        const time = process.hrtime();
        __log(`__**${game.name}**__ - starting update...`);

        for (const {
                data_settings,
                game_account_info,
                tag_ids
            } of tags) {

            await Server.gameAPI[game.id].getDataOneByOne(counters, game, data_settings, game_account_info, tag_ids);

        }
        const elapsedTimeS = process.hrtime(time)[0];
        const elapsedTimeMS = process.hrtime(time)[1] / 1000000;

        __log(`__**${game.name}**__ - update finished in **${elapsedTimeS}s ${elapsedTimeMS}ms**`);
        __logRecap(`__**${game.name}**__ - **${counters.totalTags}** tags updated for a total of **${counters.totalRequests}** requests in **${elapsedTimeS}s**.\n\nMax: **${game.ratelimit.total/game.ratelimit.every*game.ratelimit.request} / ${game.ratelimit.total}s**`);
        return resolve(`${game.name} - ${counters.totalTags} tags updated for a total of ${counters.totalRequests} requests in ${elapsedTimeS}s.\n\nMax: ${game.ratelimit.total/game.ratelimit.every*game.ratelimit.request} / ${game.ratelimit.total}s`);
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
                    result = gameTag.data[key][setting][result.toUpperCase()];
                    break;
                case 'format':
                    result = gameTag.data[key][setting](result);
                    break;

                default:
                    break;
            }
        }

        return result;
    }
};