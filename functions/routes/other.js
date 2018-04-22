//=======================================================================//
//     OTHER functions                                                   //
//=======================================================================//

module.exports = {


    /* Check parameters */

    checkParamsContact(params, user) {
        return new Promise((resolve, reject) => {

            let contactData = {
                username: null,
                type: null,
                title: null,
                message: null
            };

            // Check mandatory params
            if (params.username && typeof params.username == 'string' &&
                params.username.trim().length > 0 && params.username.length <= 50) contactData.username = params.username;
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing username')));

            if (params.type && typeof params.type == 'string') {
                switch (params.type.toLowerCase()) {
                    case 'bug-report':
                    case 'suggestion':
                    case 'request':
                        contactData.type = params.type.toLowerCase();
                        break;

                    default:
                        contactData.type = 'other';
                        break;
                }
            } else return reject((Server.fn.api.jsonError(400, 'Bad or Missing type')));

            if (params.title && typeof params.title == 'string' &&
                params.title.trim().length > 0 && params.title.length <= 50) contactData.title = params.title;
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing title')));

            if (params.message && typeof params.message == 'string' &&
                params.message.trim().length > 0 && params.message.length <= 500) contactData.message = params.message;
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing message')));

            // Use user if logged in
            if (user) contactData.user = user;

            resolve(contactData);

        });
    },

    /* Functions */

    contactMe(data) {
        return new Promise((resolve, reject) => {

            Server.fn.dbMethods.contact.insert({
                    type: data.type,
                    username: data.user ? data.user.username : data.username,
                    title: data.title,
                    message: data.message,
                    created: Date.now()
                })
                .then(() => resolve(Server.fn.api.jsonSuccess(200, __logContactMe({
                    username: data.user ? data.user.username : data.username,
                    pp: data.user ? data.user.profile_image_url : null,
                    type: data.type,
                    title: data.title,
                    message: data.message,
                }))))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t send message', '[DB] contactMe() error', err)));

        });
    },

};