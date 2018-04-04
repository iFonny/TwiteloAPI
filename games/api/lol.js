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

            // If one of this tag -> update datas
            if (tag_ids.LOL__RANKED_SOLO_SR__TIER || tag_ids.LOL__RANKED_SOLO_SR__DIVISION || tag_ids.LOL__RANKED_SOLO_SR__LP) {
                const res = await Server.fn.game[game.id].fonctionCoolQuiRecupereDesChoses(game_account_info.summoner_id, game_account_info.region);
                reqCounter += res.requests;
                //console.log('nice');
            }
            if (tag_ids.LOL__TOP1__TIER) {
                const res = await Server.fn.game[game.id].fonctionCoolQuiRecupereDesChoses();
                reqCounter += res.requests;
            }

            console.log(reqCounter);



            //console.log(iterator);
        }

        /*
        let gameDatas = [];

        "game_id": "lol",
        "tag_id": "LOL__RANKED_SOLO_SR__TIER"
        "dataSettings": {
            "game": "ori",
            "category": "any%"
        }
        "game_account_info": {
            "account_id": "204805322",
            "region": "euw",
            "summoner_id": "46741395"
        },

        tags = [{
            "game_account_info": {
                "account_id": "204805322",
                "region": "euw",
                "summoner_id": "46741395"
            }, // de la table account (obtenu (et remplace) avec account_id)
            "created": 1522819163251,
            "dataSettings": {
                "game": "ori"
            },
            "game_id": "lol",
            "id": "104fa55a-434f-47ae-a887-2ae154f9e045",
            "included": true,
            "settings": {
                "format": "uppercase",
                "size": "default"
            },
            "size": 10,
            "tag_id": "LOL__RANKED_SOLO_SR__TIER",
            "user_id": "05e9ac42-b2db-4858-af6b-b5dda3710e7f"
        }];







        tags = {
            LOL__RANKED_SOLO_SR__TIER: true,
            LOL__RANKED_SOLO_SR__DIVISION: true,
            LOL__RANKED_SOLO_SR__LP: true,
            LOL__RANKED_FLEX_SR__TIER: true,
            LOL__RANKED_FLEX_SR__DIVISION: true,
            LOL__RANKED_FLEX_SR__LP: true
        };

        for (const account of accounts) {
            if (!tags ||
                tags.LOL__RANKED_SOLO_SR__TIER || tags.LOL__RANKED_SOLO_SR__DIVISION || tags.LOL__RANKED_SOLO_SR__LP) {
                //const data = await Server.fn.game.lol.fonctionCoolQuiRecupereDesChoses(account.game_account_info, account.settings.region);
                //console.log(Server.fn.game.utils.formatGameDataForDB(account, data.username));
                //console.log('RANKED_SOLO_SR' + account.id);
            }
            */

        /* if (!tags ||
                tags.LOL__RANKED_FLEX_SR__TIER || tags.LOL__RANKED_FLEX_SR__DIVISION || tags.LOL__RANKED_FLEX_SR__LP) {
                console.log(await Server.fn.game.lol.fonctionCoolQuiRecupereDesChoses(account.game_account_info, account.settings.region));
                console.log('RANKED_FLEX_SR' + account.id);
            } 
        }

*/

        /*

        let size = Server.fn.game.utils.getDataSize(Server.gameTags['lol']['LOL__RANKED_SOLO_SR__TIER'], {
            format: 'capitalize',
            size: 'default'
        });
        console.log(size);





        let exGameData = {
            LOL__RANKED_SOLO_SR__TIER: 'diamond',
            LOL__RANKED_SOLO_SR__DIVISION: '4',
            LOL__RANKED_SOLO_SR__LP: '13',
            LOL__RANKED_FLEX_SR__TIER: 'silver',
            LOL__RANKED_FLEX_SR__DIVISION: '2',
            LOL__RANKED_FLEX_SR__LP: '100'
        };

        let account = {
            id: 'f4e81a0e-f5e8-4eb3-bf95-c5203e1d87b9',
            included: true,
            user_id: '8a766142-be00-4661-abeb-a9e3e912dc05',
            game_account_info: '46741395', // id du compte dans le jeu
            game_id: 'lol',
            verified: true,
            created: 1519639337231,
            settings: {
                username: 'iFonny',
                region: 'euw'
            }
        };

        // TODO: Get stats en fonction des tags demandés (mettre a null les champs qui ne doivent pas changer ou contienne une error)

        resolve({
            user_id: '8a766142-be00-4661-abeb-a9e3e912dc05',
            account_id: '7a666132-be00-4761-abeb-a9e3e912dc14',
            game_id: 'lol',
            tag_id: 'LOL__RANKED_SOLO_SR__TIER',
            updated: Date.now(),
            data: 'diamond'
        });

        resolve({
            [account.id]: {
                account: account,
                gameData: exGameData
            }
        });*/
        resolve();

    });
};

/*
 ** (TODO?? faire des fonctions qui genere des settings OU les ajouter directement dans les tags)
 ** Add game data settings and update database
 **
 ** Params : 
 ** - accountsData (required): Object key by account id with account + game data
 **
 ** Return: ??
 */
module.exports.updateAccountsGameData = (accountsData) => {
    return new Promise((resolve, reject) => {

        for (const accountID in accountsData) {
            const accountData = accountsData[accountID];

            for (const tagID in accountData.gameData) {
                let tagData = accountData.gameData[tagID];

                switch (tagID) {
                    case 'LOL__RANKED_SOLO_SR__TIER':
                        tagData = this.generator.tier(Server.gameTags['lol']['LOL__RANKED_SOLO_SR__TIER'], tagData, {
                            format: 'capitalize',
                            size: 'short'
                        });
                        break;
                    default:
                        break;
                }

                console.log(tagData);
            }
        }

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