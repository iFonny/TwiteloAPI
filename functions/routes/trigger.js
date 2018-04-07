//=======================================================================//
//     TRIGGER functions                                                 //
//=======================================================================//

module.exports = {


    /* Check parameters */

    checkParamsTriggerByGame(URLparams) {
        return new Promise((resolve, reject) => {

            // Check mandatory params
            if (URLparams.gameID && URLparams.gameID.length > 0) return resolve(URLparams.gameID);
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing parameters')));

        });
    },


    /* Functions */

    getAllTriggers() {
        return new Promise((resolve, reject) => {
            Server.fn.dbMethods.trigger.getAll()
                .then(triggers => {
                    for (const key in triggers) {
                        triggers[key].game = Server.game[triggers[key].game_id].small_name;
                    }
                    resolve(Server.fn.api.jsonSuccess(200, triggers));
                })
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] getAllTriggers() error', err)));
        });
    },

    getAllTriggersByGame(gameID) {
        return new Promise((resolve, reject) => {
            Server.fn.dbMethods.trigger.getAllByGame(gameID)
                .then(triggers => {
                    for (const key in triggers) {
                        triggers[key].game = Server.game[triggers[key].game_id].small_name;
                    }
                    resolve(Server.fn.api.jsonSuccess(200, triggers));
                })
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] getAllTriggersByGame() error', err)));
        });
    },

};