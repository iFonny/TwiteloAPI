//=======================================================================//
//     USER functions                                                    //
//=======================================================================//

module.exports = {


    /* Check parameters */



    /* Functions */

    getUser(id) {
        return new Promise((resolve, reject) => {
            Server.fn.dbMethods.user.get(id)
                .then(user => resolve(Server.fn.api.jsonSuccess(200, user)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] getUser() error', err)));
        });
    },

    async getStats(user, join) {
        try {
            const all = await Server.fn.dbMethods.user.count({});
            const active = await Server.fn.dbMethods.user.count({
                switch: true
            });

            return Promise.resolve({
                join,
                username: user.username,
                pp: user.profile_image_url,
                count: {
                    all,
                    active
                }
            });
        } catch (err) {
            return Promise.reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] getUser() error', err));
        }
    },

    getTwitterUserData(user) {
        return new Promise((resolve, reject) => {

            var client = new Server.Twitter({
                consumer_key: config.secret.twitter.consumerKey,
                consumer_secret: config.secret.twitter.consumerSecret,
                access_token_key: user.tokens.token,
                access_token_secret: user.tokens.tokenSecret
            });

            client.get('account/verify_credentials', {
                skip_status: true
            }).then((profile) => {
                resolve({
                    username: profile.screen_name,
                    name: profile.name,
                    protected: profile.protected,
                    verified: profile.verified,
                    followers: profile.followers_count,
                    lang: profile.lang,
                    profile_image_url: profile.profile_image_url.replace('_normal', '_400x400'),
                    description: profile.description,
                    updated: Date.now()
                });
            }).catch(err => reject(Server.fn.api.jsonError(403, 'Invalid or expired token.', `[Twitter] Can't get credentials for @${user.username} (${user.twitter_id})`, err)));

        });
    },

    updateUser(id, twitterData) {
        return new Promise((resolve, reject) => {
            Server.fn.dbMethods.user.update(id, twitterData)
                .then((result) => resolve(result.unchanged ? true : false))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] updateUser() error', err)));
        });
    },

    deleteUser(user) {
        return new Promise((resolve, reject) => {

            Server.fn.dbMethods.user.moveToDeleted(user)
                .then(() => Server.fn.dbMethods.user.delete(user.id))
                .then(() => resolve(Server.fn.api.jsonSuccess(200, true)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] deleteUser() error', err)));

        });
    },

};