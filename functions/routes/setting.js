//=======================================================================//
//     GAME functions                                                    //
//=======================================================================//

module.exports = {


    /* Check parameters */

    checkParamsPPTriggerIDs(params) {
        return new Promise((resolve, reject) => {

            // Check mandatory params
            if (params && Array.isArray(params)) return resolve(params);
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing parameters')));
        });
    },

    checkParamsLocale(params) {
        return new Promise((resolve, reject) => {

            // Check mandatory params
            if (typeof params.locale == 'string' &&
                config.constant.locales.includes(params.locale.toLowerCase())) return resolve(params.locale.toLowerCase());
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing locale')));
        });
    },

    checkParamsSwitchStatus(params) {
        return new Promise((resolve, reject) => {

            // Check mandatory params
            if (typeof params.status && !isNaN(parseInt(params.status, 2))) return resolve(Boolean(parseInt(params.status, 2)));
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing status')));
        });
    },

    checkParamsSwitchNameStatus(params) {
        return new Promise((resolve, reject) => {

            // Check mandatory params
            if ((typeof params.status && !isNaN(parseInt(params.status, 2))) && typeof params.name == 'string')
                return resolve({
                    name: params.name.toLowerCase(),
                    status: Boolean(parseInt(params.status, 2))
                });
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing parameters')));
        });
    },


    checkParamsEditPPTrigger(params) {
        return new Promise((resolve, reject) => {

            let ppTrigger = {};

            // Check mandatory params
            if (params.id && typeof params.id == 'string') ppTrigger.id = params.id;
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing ID')));

            if (params.triggerID && typeof params.triggerID == 'string') ppTrigger.trigger_id = params.triggerID;
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing trigger ID')));

            if (params.image && typeof params.image == 'string') {
                const mime = params.image.match(/^data:(image\/\w+);base64,[\s\S]+/);
                let noHeader = params.image.split('base64,')[1];
                const fileSize = noHeader.replace(/=/g, '').length * 0.75 / 1000;

                if (Server.base64.isBase64(params.image) &&
                    (mime && ['image/jpeg', 'image/gif', 'image/png'].includes(mime[1])) &&
                    fileSize <= config.media.maxSize) ppTrigger.image = params.image;
                else return reject((Server.fn.api.jsonError(400, 'Bad image or bad size')));
            }
            resolve(ppTrigger);

        });
    },


    /* Functions */

    getAllSettings(userID) {
        return new Promise((resolve, reject) => {
            Server.fn.dbMethods.setting.getAll(userID)
                .then(this.formatSettings)
                .then(settings => resolve(Server.fn.api.jsonSuccess(200, settings)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] getAllSettings() error', err)));
        });
    },

    createEmptyPPTriggerSetting(userID) {
        return new Promise((resolve, reject) => {
            Server.fn.dbMethods.setting.count(userID, {
                type: 'pp_trigger'
            }).then((total) => {
                if (total < config.constant.limits.ppTrigger) {
                    Server.fn.dbMethods.setting.insert({
                            user_id: userID,
                            type: 'pp_trigger',
                            trigger_id: null,
                            path: null,
                            created: Date.now()
                        })
                        .then(result => resolve(Server.fn.api.jsonSuccess(200, (result.changes[0].new_val.game = null, result.changes[0].new_val))))
                        .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] createEmptyPPTriggerSetting() error', err)));
                } else reject(Server.fn.api.jsonError(405, `Can't create more ppTrigger (limit: ${config.constant.limits.ppTrigger})`, `Can't create more ppTrigger (limit: ${config.constant.limits.ppTrigger})`));

            }).catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] count settings error', err)));
        });
    },

    updatePPTrigger(userID, ppTrigger) {
        return new Promise((resolve, reject) => {

            if (ppTrigger.image) {
                Server.makeDir(`${config.root}${config.media.path.pp}/${userID}`) // Create dir if doesn't exist
                    .then(path => {
                        const filepath = Server.base64.utils.imgSync(ppTrigger.image, path, ppTrigger.id); // Save base64 image
                        ppTrigger.path = filepath.replace(`${config.root}${config.media.path.root}`, '');
                        delete ppTrigger.image; // Delete base64 image from object
                        return Promise.resolve(ppTrigger);
                    })
                    .then((ppTrigger) => Server.fn.dbMethods.setting.update(userID, ppTrigger))
                    .then((result) => resolve(Server.fn.api.jsonSuccess(200, result.changes && result.changes.length ? result.changes[0].new_val : false)))
                    .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] updatePPTrigger() image error', err)));
            } else {
                Server.fn.dbMethods.setting.update(userID, ppTrigger)
                    .then((result) => resolve(Server.fn.api.jsonSuccess(200, result.changes && result.changes.length ? result.changes[0].new_val : false)))
                    .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] updatePPTrigger() error', err)));
            }

        });
    },

    updateUserGlobalSwitch(userID, status) {
        return new Promise((resolve, reject) => {
            Server.fn.dbMethods.user.update(userID, {
                    switch: status
                })
                .then(() => resolve(Server.fn.api.jsonSuccess(200, status)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] updateUserGlobalSwitch() error', err)));
        });
    },

    updateTwiteloSwitch(userID, name, status) {
        return new Promise((resolve, reject) => {
            Server.fn.dbMethods.user.update(userID, {
                    twitelo: {
                        [name]: {
                            status
                        }
                    }
                })
                .then(() => resolve(Server.fn.api.jsonSuccess(200, status)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] updateTwiteloSwitch() error', err)));
        });
    },

    updateNotificationSwitch(userID, name, status) {
        return new Promise((resolve, reject) => {
            Server.fn.dbMethods.user.update(userID, {
                    settings: {
                        notifications: {
                            [name]: status
                        }
                    }
                })
                .then(() => resolve(Server.fn.api.jsonSuccess(200, status)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] updateNotificationSwitch() error', err)));
        });
    },

    updateSetting(userID, name, value) {
        return new Promise((resolve, reject) => {
            Server.fn.dbMethods.user.update(userID, {
                    settings: {
                        [name]: value
                    }
                })
                .then(() => resolve(Server.fn.api.jsonSuccess(200, value)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] updateNotificationSwitch() error', err)));
        });
    },

    deletePPTriggers(userID, IDs) {
        return new Promise((resolve, reject) => {
            Server.fn.dbMethods.setting.getAllWithPathByIDs(userID, IDs)
                .then((ppTriggers) => this.deletePPTriggerImages(ppTriggers))
                .then(() => Server.fn.dbMethods.setting.deleteByIDs(userID, IDs))
                .then(() => resolve(Server.fn.api.jsonSuccess(200, true)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] deletePPTriggers() error', err)));
        });
    },


    /* Utils */

    deletePPTriggerImages(ppTriggers) {
        return new Promise((resolve) => {
            for (let ppTrigger of ppTriggers) {
                try {
                    Server.fs.unlinkSync(`${config.root}${config.media.path.root}${ppTrigger.path}`);
                } catch (error) {
                    __logError(`Can't delete file ${ppTrigger.id}`, error);
                }
            }
            resolve();
        });
    },

    formatSettings(settings) {
        return new Promise(async (resolve, reject) => {
            try {
                let formatedSettings = _.groupBy(settings, 'type');
                const triggers = _.keyBy(await Server.fn.dbMethods.trigger.getAll(), 'id');

                for (const key in triggers) {
                    triggers[key].game = Server.game[triggers[key].game_id].small_name;
                }

                for (const key in formatedSettings) {
                    for (const settingKey in formatedSettings[key]) {
                        formatedSettings[key][settingKey].game = triggers[formatedSettings[key][settingKey].trigger_id] ?
                            triggers[formatedSettings[key][settingKey].trigger_id].game :
                            null;
                    }
                    formatedSettings[key] = _.keyBy(formatedSettings[key], 'id');
                }
                // Create empty settings if doesn't exist for the user
                if (!formatedSettings.pp_trigger) formatedSettings.pp_trigger = {};

                resolve(formatedSettings);
            } catch (error) {
                reject(error);
            }

        });
    },
};