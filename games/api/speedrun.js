/*
 ** Get & resolve game account ID
 **
 ** Params: 
 ** - settings (required: account settings
 **
 ** Return: 
 ** - string: account ID in game
 */
module.exports.getAccountID = (settings) => {

    return new Promise((resolve, reject) => {

        // TODO
        resolve('46741395');

    });

};

/*
 ** Update db & resolve game data for accounts
 **
 ** Params : 
 ** - accounts (required): Array of accounts
 ** - object (optional): Object with tags to update (all if undefined) like : 
 **            {LOL__RANKED_SOLO_SR__TIER: true, LOL__RANKED_SOLO_SR__LP: true}
 **
 ** Return: 
 ** - array: array with game accounts data
 */
module.exports.updateAccountGameData = (accounts, tags) => {

    return new Promise((resolve, reject) => {

        // TODO: Get stats
        // TODO: Update db
        resolve('[{Toutes les stats/rank de luser}]');

    });

};