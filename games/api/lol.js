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
 **     tag_ids: [ 'LOL__RANKED_SOLO_SR__DIVISION', 'LOL__RANKED_SOLO_SR__TIER' ] 
 ** }]
 **
 ** Return (Promise): 
 ** - ??
 */

module.exports.updateGameData = (game, tags) => {
    return new Promise(async (resolve, reject) => {

        let reqCounter = 0;
        let totalRequests = 0;

        for (const {
                data_settings,
                game_account_info,
                tag_ids
            } of tags) {

            // If one of this tag -> update data
            if (tag_ids.LOL__RANKED_SOLO_SR__TIER || tag_ids.LOL__RANKED_SOLO_SR__DIVISION || tag_ids.LOL__RANKED_SOLO_SR__LP) {
                const res = await Server.fn.game[game.id].fonctionCoolQuiRecupereDesChoses(game_account_info.summoner_id, game_account_info.region);

                // TODO: update db avec les données (data dans res.data)

                reqCounter += res.requests;
                totalRequests += res.requests;
                reqCounter = await Server.fn.game.utils.useMeAfterEachRequest_SometimesIFeelTired(game.ratelimit, reqCounter);
            }

        }
        console.log('total: ', totalRequests);

        resolve();

    });
};

//=======================================================================//
//     GENERATOR                                                         //
//=======================================================================//

module.exports.generator = {
    tier(tag, data, settings) {
        let result = data;

        for (const key of tag.settingsOrder) {
            const setting = settings[key];

            switch (key) {
                case 'size':
                    result = tag.data[key][setting][result.toUpperCase()];
                    break;
                case 'format':
                    result = tag.data[key][setting](result);
                    break;

                default:
                    break;
            }
        }

        return result;
    }
};