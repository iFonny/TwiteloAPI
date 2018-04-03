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

    checkParamsAccountUpdateSettings(bodyParams, urlParams) {
        return new Promise((resolve, reject) => {

            let account = {
                id: '',
                game_id: '',
                settings: {}
            };

            // Check mandatory params
            if (urlParams.id && typeof urlParams.id == 'string' && urlParams.id.length > 0) account.id = urlParams.id;
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing id')));

            if (bodyParams.game_id && typeof bodyParams.game_id == 'string' && Server.gameAPI[bodyParams.game_id]) account.game_id = bodyParams.game_id;
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing game_id')));

            if (bodyParams.settings && Server.gameSettings[account.game_id]) {
                for (const key in Server.gameSettings[account.game_id]) {
                    if (key == 'verified' || bodyParams.settings[key] != null && ['boolean', 'string', 'number'].includes(typeof bodyParams.settings[key])) {
                        if (key != 'verified') account.settings[key] = bodyParams.settings[key];
                    } else return reject((Server.fn.api.jsonError(400, `Bad or Missing '${key}' setting`)));
                }
            } else return reject((Server.fn.api.jsonError(400, 'Bad or Missing settings')));

            resolve(account);

        });
    },

    checkParamsAccountID(params) {
        return new Promise((resolve, reject) => {

            // Check mandatory params
            if (params.id && typeof params.id == 'string' && params.id.length > 0) resolve(params.id);
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing id')));
        });
    },

    /* Functions */

    getAll(userID) {
        return new Promise((resolve, reject) => {

            Server.fn.dbMethods.account.getAll(userID)
                .then(accounts => resolve(Server.fn.api.jsonSuccess(200, accounts)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t get accounts', '[DB] getAll() error', err)));

        });
    },

    getAccount(userID, id) {
        return new Promise((resolve, reject) => {

            Server.fn.dbMethods.account.get(userID, id)
                .then(accounts => resolve(Server.fn.api.jsonSuccess(200, accounts[0])))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Can\' get account', '[DB] getAccount() error', err)));

        });
    },

    getAccountID(userID, account) {
        return new Promise((resolve, reject) => {

            Server.gameAPI[account.game_id].getAccountID(account.settings)
                .then((id) => {
                    if (id) resolve((account.user_id = userID, account.game_account_id = id, account.verified = false, account));
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
                    account.included = false;
                    Server.fn.dbMethods.account.insert(account)
                        .then((result) => resolve(result.changes[0].new_val))
                        .catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t create account', '[DB] createAccount() error', err)));
                } else reject(Server.fn.api.jsonError(405, `Can't add more accounts (limit: ${config.constant.limits.accountbyGame})`, `Can't add more accounts (limit: ${config.constant.limits.accountbyGame})`));

            }).catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] count account error', err)));

        });
    },

    updateAccountGameData(account) {
        return new Promise((resolve, reject) => {

            Server.gameAPI[account.game_id].getAccountsGameData([account]) // TODO: create an error if ratelimit
                .then((accountsData) => Server.gameAPI[account.game_id].updateAccountsGameData(accountsData))
                .then(() => resolve(Server.fn.api.jsonSuccess(200, account)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t update game data', '[DB] updateAccountGameData() error', err)));

        });
    },

    updateAccountSettings(userID, account) {
        return new Promise((resolve, reject) => {

            Server.fn.dbMethods.account.update(userID, account)
                .then(async (result) => {
                    if (result.replaced) resolve(Server.fn.api.jsonSuccess(200, result.changes[0].new_val));
                    else resolve(Server.fn.api.jsonSuccess(200, false));
                })
                .catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t create account', '[DB] createAccount() error', err)));

        });
    },

    getTagsToDelete(userID, accountID) {
        return new Promise((resolve, reject) => {

            Server.fn.dbMethods.tag.getWithFilter(userID, {
                    account_id: accountID
                })
                .then((tags) => resolve({
                    account: accountID,
                    tags: tags.map(tag => tag.id)
                }))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t get tags to delete', '[DB] getTagsToDelete() error', err)));

        });
    },

    deleteTagsFromProfile(user, data) {
        return new Promise((resolve, reject) => {
            function removeFromProfile(text, ids) {
                const re = new RegExp(ids.join('|'), 'g');
                return text.replace(re, '');
            }

            const ids = data.tags.map(tag => `<{${tag}}>`);

            const twitelo = {
                description: {
                    content: removeFromProfile(user.twitelo.description.content.trim(), ids)
                },
                name: {
                    content: removeFromProfile(user.twitelo.name.content.trim(), ids)
                },
                location: {
                    content: removeFromProfile(user.twitelo.location.content.trim(), ids)
                },
                url: {
                    content: removeFromProfile(user.twitelo.url.content.trim(), ids)
                }
            };

            Server.fn.dbMethods.user.update(user.id, {
                    twitelo
                })
                .then(() => resolve(data))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t delete tags from profile', '[DB] deleteTagsFromProfile() error', err)));
        });
    },

    deleteTagsAndAccount(userID, account, tags) {
        return new Promise((resolve, reject) => {

            Server.fn.dbMethods.tag.deleteByIDs(userID, tags)
                .then(() => Server.fn.dbMethods.account.delete(userID, account))
                .then((result) => resolve(Server.fn.api.jsonSuccess(200, result.deleted ? true : false)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t delete tags or account', '[DB] deleteTagsAndAccount() error', err)));

        });
    }
};