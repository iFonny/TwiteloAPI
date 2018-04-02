/*
 ** Get & resolve game account ID
 **
 ** Params: 
 ** - settings (required: account settings
 **
 ** Return (Promise): 
 ** - string: account ID in game
 */
module.exports.getAccountID = (settings) => {
    return new Promise((resolve, reject) => {

        // TODO
        resolve('46741395');

    });
};

/*
 ** Resolve game data for accounts
 **
 ** Params : 
 ** - accounts (required): Array of accounts
 ** - object (optional): Object with tags to update (all if undefined) like : 
 **            {LOL__RANKED_SOLO_SR__TIER: true, LOL__RANKED_SOLO_SR__LP: true}
 **
 ** Return (Promise): 
 ** - object: object of accounts key by id (db id) with account && game data
 */
module.exports.getAccountsGameData = (accounts, tags) => {
    return new Promise((resolve, reject) => {

        let exGameData = {
            LOL__RANKED_SOLO_SR__TIER: 'diamond',
            LOL__RANKED_SOLO_SR__LP: '13',
        };

        // TODO: Get stats en fonction des tags demandés (mettre a null les champs qui ne doivent pas changer ou contienne une error)

        resolve({
            'accountID': {
                account: 'account',
                gameData: exGameData
            },
            'accountID2': {
                account: 'account2',
                gameData: exGameData
            },
        });

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
        resolve();
    });
};



//=======================================================================//
//     GENERATOR                                                         //
//=======================================================================//

module.exports.generator = (gameTagID, data) => {

    switch (gameTagID) {
        case 'LOL__RANKED_SOLO_SR__TIER':

            break;

        default:
            return null;
    }

};