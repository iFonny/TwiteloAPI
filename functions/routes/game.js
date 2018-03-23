//=======================================================================//
//     GAME functions                                                    //
//=======================================================================//

module.exports = {


    /* Check parameters */



    /* Functions */

    getEnabledGames() {
        return new Promise((resolve, reject) => {
            Server.fn.dbMethods.game.getEnabled()
                .then(games => resolve(Server.fn.api.jsonSuccess(200, games)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] getEnabledGames() error', err)));
        });
    },

    getEnabledGamesMin() {
        return new Promise((resolve, reject) => {
            Server.fn.dbMethods.game.getEnabledMin()
                .then(games => resolve(Server.fn.api.jsonSuccess(200, games)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] getEnabledGamesMin() error', err)));
        });
    },

};