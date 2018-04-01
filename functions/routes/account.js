//=======================================================================//
//     ACCOUNT functions                                                 //
//=======================================================================//

module.exports = {


    /* Check parameters */

    checkParamsAccountCreate(params) {
        return new Promise((resolve, reject) => {

            let account = {
                game_id: '',
                settings: {}
            };

            // Check mandatory params
            if (params.game_id && typeof params.game_id == 'string' && Server.gameAPI[params.game_id]) account.game_id = params.game_id;
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing game_id')));

            if (params.settings && Server.gameSettings[account.game_id]) {
                for (const key in Server.gameSettings[account.game_id]) {
                    if (key == 'verified' || params.settings[key] != null && ['boolean', 'string', 'number'].includes(typeof params.settings[key])) {
                        if (key != 'verified') account.settings[key] = params.settings[key];
                    } else return reject((Server.fn.api.jsonError(400, `Bad or Missing '${key}' setting`)));
                }
            } else return reject((Server.fn.api.jsonError(400, 'Bad or Missing settings')));

            resolve(account);

        });
    },
    /*

        checkParamsTagID(params) {
            return new Promise((resolve, reject) => {

                // Check mandatory params
                if (params.id && typeof params.id == 'string' && params.id.length > 0) resolve(params.id);
                else return reject((Server.fn.api.jsonError(400, 'Bad or Missing id')));
            });
        },
        */

    /* Functions */

    getAll(userID) {
        return new Promise((resolve, reject) => {

            Server.fn.dbMethods.account.getAll(userID)
                .then(accounts => resolve(Server.fn.api.jsonSuccess(200, accounts)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t get accounts', '[DB] getAll() error', err)));

        });
    },

    getAccountID(userID, account) {
        return new Promise((resolve, reject) => {

            Server.gameAPI[account.game_id].getAccountID()
                .then((id) => {
                    if (id) resolve((account.user_id = userID, account.account_id = id, account.verified = false, account));
                    else reject(Server.fn.api.jsonError(404, 'Account not found'));
                })
                .catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t get game account', '[DB] getAccountID() error', err)));

        });
    },

    createAccount(account) {
        return new Promise((resolve, reject) => {

            Server.fn.dbMethods.account.count(account.user_id, {
                game_id: account.game_id
            }).then((total) => {
                if (total < config.constant.limits.accountbyGame) {
                    account.created = Date.now();
                    Server.fn.dbMethods.account.insert(account)
                        .then((result) => resolve(result.changes[0].new_val))
                        .catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t create account', '[DB] createAccount() error', err)));
                } else reject(Server.fn.api.jsonError(405, `Can't add more accounts (limit: ${config.constant.limits.accountbyGame})`, `Can't add more accounts (limit: ${config.constant.limits.accountbyGame})`));

            }).catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] count account error', err)));

        });
    },

    updateAccountGameData(account) {
        return new Promise((resolve, reject) => {

            Server.gameAPI[account.game_id].updateAccountGameData(account)
                .then(() => resolve(Server.fn.api.jsonSuccess(200, account)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t update game data', '[DB] updateAccountGameData() error', err)));

        });
    }
};