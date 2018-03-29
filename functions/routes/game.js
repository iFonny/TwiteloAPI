//=======================================================================//
//     GAME functions                                                    //
//=======================================================================//

module.exports = {


    /* Check parameters */

    checkParamsTagByGame(URLparams) {
        return new Promise((resolve, reject) => {

            // Check mandatory params
            if (URLparams.gameID && URLparams.gameID.length > 0 && Server.tags[URLparams.gameID]) return resolve(URLparams.gameID);
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

    /* Tags */

    getAllTags() {
        return Promise.resolve(Server.fn.api.jsonSuccess(200, Server.tags));
    },

    getTagsByGame(gameID) {
        return Promise.resolve(Server.fn.api.jsonSuccess(200, Server.tags[gameID]));
    },
};