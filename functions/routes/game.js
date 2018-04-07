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
            if (URLparams.gameID && typeof URLparams.gameID == 'string' && URLparams.gameID.length > 0 && Server.gameTags[URLparams.gameID]) return resolve(URLparams.gameID);
            else return reject((Server.fn.api.jsonError(400, 'Game not found')));

        });
    },

    /* Functions */

    getGames() {
        return Promise.resolve(Server.fn.api.jsonSuccess(200, Server.game));
    },

    getGame(gameID) {
        if (Server.game[gameID]) return Promise.resolve(Server.fn.api.jsonSuccess(200, Server.game[gameID]));
        else return Promise.reject(Server.fn.api.jsonError(400, 'Game not found'));
    },

    /* Tags */

    getAllTags() {
        return Promise.resolve(Server.fn.api.jsonSuccess(200, Server.gameTags));
    },

    getTagsByGame(gameID) {
        if (Server.gameTags[gameID]) return Promise.resolve(Server.fn.api.jsonSuccess(200, _.mapValues(Server.gameTags[gameID], o => _.omit(o, 'data'))));
        else return Promise.reject(Server.fn.api.jsonError(400, 'Game not found'));
    },

    /* Settings */

    getAllSettings() {
        return Promise.resolve(Server.fn.api.jsonSuccess(200, Server.gameSettings));
    },

    getSettingsByGame(gameID) {
        if (Server.gameSettings[gameID]) return Promise.resolve(Server.fn.api.jsonSuccess(200, Server.gameSettings[gameID]));
        else return Promise.reject(Server.fn.api.jsonError(400, 'Game not found'));
    },
};