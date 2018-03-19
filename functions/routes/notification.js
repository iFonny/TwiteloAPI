//=======================================================================//
//     NOTIFICATION functions                                            //
//=======================================================================//

module.exports = {


    /* Check parameters */

    checkParamsNotificationLimit(URLparams) {
        return new Promise((resolve, reject) => {

            // Check mandatory params
            if (URLparams.limit && parseInt(URLparams.limit, 10)) return resolve(parseInt(URLparams.limit, 10));
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing parameters')));

        });
    },

    checkParamsNotificationIDs(params) {
        return new Promise((resolve, reject) => {

            // Check mandatory params
            if (params && Array.isArray(params)) return resolve(params);
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing parameters')));

        });
    },


    /* Functions */

    getAllNotifications(userID, limit) {
        return new Promise((resolve, reject) => {

            if (limit) Server.fn.dbMethods.notification.getAllByUserLimit(userID, limit)
                .then(notifications => resolve(Server.fn.api.jsonSuccess(200, notifications)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] getAllNotifications() (limit) error', err)));
            else Server.fn.dbMethods.notification.getAllByUser(userID)
                .then(notifications => resolve(Server.fn.api.jsonSuccess(200, notifications)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] getAllNotifications() error', err)));

        });
    },

    getUnarchivedNotifications(userID, limit) {
        return new Promise((resolve, reject) => {

            if (limit) Server.fn.dbMethods.notification.getUnarchivedByUserLimit(userID, limit)
                .then(notifications => resolve(Server.fn.api.jsonSuccess(200, notifications)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] getUnarchivedNotifications() (limit) error', err)));
            else Server.fn.dbMethods.notification.getUnarchivedByUser(userID)
                .then(notifications => resolve(Server.fn.api.jsonSuccess(200, notifications)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] getUnarchivedNotifications() error', err)));

        });
    },

    archiveNotifications(userID, IDs) {
        return new Promise((resolve, reject) => {

            Server.fn.dbMethods.notification.update(userID, IDs, {
                    archived: true
                })
                .then(() => resolve(Server.fn.api.jsonSuccess(200, true)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] archiveNotifications() error', err)));

        });
    },

    unarchiveNotifications(userID, IDs) {
        return new Promise((resolve, reject) => {

            Server.fn.dbMethods.notification.update(userID, IDs, {
                    archived: false
                })
                .then(() => resolve(Server.fn.api.jsonSuccess(200, true)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] archiveNotifications() error', err)));

        });
    },


};