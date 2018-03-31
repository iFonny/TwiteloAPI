//=======================================================================//
//     GAME functions                                                    //
//=======================================================================//

module.exports = {


    /* Check parameters */

    checkParamsGameID(URLparams) {
        return new Promise((resolve, reject) => {

            // Check mandatory params
            if (URLparams.gameID && typeof URLparams.gameID == 'string' && URLparams.gameID.length > 0) return resolve(URLparams.gameID);
            else return reject((Server.fn.api.jsonError(400, 'Game not found')));

        });
    },

    checkParamsTagByGame(URLparams) {
        return new Promise((resolve, reject) => {

            // Check mandatory params
            if (URLparams.gameID && typeof URLparams.gameID == 'string' && URLparams.gameID.length > 0 && Server.tags[URLparams.gameID]) return resolve(URLparams.gameID);
            else return reject((Server.fn.api.jsonError(400, 'Game not found')));

        });
    },

    /* Functions */

    getEnabledGames() {
        return new Promise((resolve, reject) => {
            Server.fn.dbMethods.game.getEnabled()
                .then(games => resolve(Server.fn.api.jsonSuccess(200, games)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] getEnabledGames() error', err)));
        });
    },

    getGame(gameID) {
        return new Promise((resolve, reject) => {
            Server.fn.dbMethods.game.get(gameID)
                .then(game => game ? resolve(Server.fn.api.jsonSuccess(200, game)) : reject(Server.fn.api.jsonError(400, 'Game not found')))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] getEnabledGames() error', err)));
        });
    },

    /* Tags */

    getAllTags() {
        return Promise.resolve(Server.fn.api.jsonSuccess(200, Server.tags));
    },

    getTagsByGame(gameID) {
        return Promise.resolve(Server.fn.api.jsonSuccess(200, Server.tags[gameID]));
    },
};