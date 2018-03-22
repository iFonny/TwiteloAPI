//=======================================================================//
//     GAME functions                                                    //
//=======================================================================//

module.exports = {


    /* Check parameters */



    /* Functions */

    getAllGames() {
        return new Promise((resolve, reject) => {
            Server.fn.dbMethods.game.getAll()
                .then(games => resolve(Server.fn.api.jsonSuccess(200, games)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] getAllGames() error', err)));
        });
    },

    getAllGamesMin() {
        return new Promise((resolve, reject) => {
            Server.fn.dbMethods.game.getAllMin()
                .then(games => resolve(Server.fn.api.jsonSuccess(200, games)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] getAllGames() error', err)));
        });
    },

};