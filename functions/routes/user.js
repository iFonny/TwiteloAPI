//=======================================================================//
//     USER functions                                                    //
//=======================================================================//

module.exports = {


    /* Check parameters */


    checkParamsSaveProfile(params) {
        return new Promise((resolve, reject) => {

            let profile = {
                name: '',
                description: '',
                location: ''
            };

            // Check mandatory params
            if (params.name && typeof params.name == 'string' && params.name.trim() != '') profile.name = params.name;
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing name')));

            if (typeof params.description == 'string') profile.description = params.description;
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing description')));

            if (typeof params.location == 'string') profile.location = params.location;
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing location')));

            resolve(profile);

        });
    },


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
                access_token: user.tokens.token,
                access_token_secret: user.tokens.tokenSecret
            });

            client.get('account/verify_credentials', {
                skip_status: true
            }, (error, twUser) => {
                if (!error) {
                    if (twUser) return resolve({
                        username: twUser.screen_name,
                        name: twUser.name,
                        protected: twUser.protected,
                        verified: twUser.verified,
                        followers: twUser.followers_count,
                        lang: twUser.lang,
                        profile_image_url: twUser.profile_image_url_https.replace('_normal', '_400x400'),
                        description: twUser.description,
                        updated: Date.now()
                    });
                    else return reject(Server.fn.api.jsonError(500, 'Internal server error', `[Twitter] Can't get credentials for @${user.username} (${user.twitter_id}) (no twUser)`, twUser));
                } else return reject(Server.fn.api.jsonError(403,
                    error.message || 'Invalid or expired token.',
                    `[Twitter] Can't get credentials for @${user.username} (${user.twitter_id})`, error));
            });

        });
    },

    updateUser(id, twitterData) {
        return new Promise((resolve, reject) => {
            Server.fn.dbMethods.user.update(id, twitterData)
                .then((result) => resolve(result.unchanged ? true : false))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] updateUser() error', err)));
        });
    },

    updateProfile(user, profile) {
        return new Promise((resolve, reject) => {

            let document = {
                twitelo: {
                    name: {
                        content: profile.name,
                    },
                    description: {
                        content: profile.description
                    },
                    location: {
                        content: profile.location
                    }
                }
            };

            if (user.freshUser) {
                document.freshUser = false;
                document.switch = true;
                document.twitelo.name.status = true;
                document.twitelo.location.status = true;
                document.twitelo.description.status = true;
            }

            Server.fn.dbMethods.user.update(user.id, document)
                .then(result => resolve(result.changes[0].new_val))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t update profile', '[DB] updateProfile() error', err)));
        });
    },

    getIncludedTagsFromText(text) {
        let includedTags = [];
        const myRegexp = /<{([^<>{} ]+?)}>/g;
        let match = myRegexp.exec(text);

        while (match != null) {
            includedTags.push(match[1]);
            match = myRegexp.exec(text);
        }
        return includedTags;
    },

    async getProfileTextLength(userID, text, tags) {
        let counter = 0;
        let removeArray = [];
        const myRegexp = /<{([^<>{} ]+?)}>/g;
        let match = myRegexp.exec(text);

        tags = await Server.fn.dbMethods.tag.getByUserAndIDs(userID, tags);
        tags = _.keyBy(tags, 'id');

        while (match != null) {
            if (tags[match[1]]) counter += tags[match[1]].size;
            removeArray.push(`<{${match[1]}}>`);
            match = myRegexp.exec(text);
        }
        if (removeArray.length > 0) {
            var re = new RegExp(removeArray.join('|').replace(/{/g, '\\{'), 'g');
            text = text.replace(re, '');
        }
        text = text.trim();
        return text.length + counter;
    },

    // If data -> just update and resolve data (don't get tags for preview)
    updateIncludedTags(user, data) {
        return new Promise(async (resolve, reject) => {

            // Get updated user
            if (data) user = await Server.fn.dbMethods.user.get(user.id)
                .catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t get user', 'get user updateIncludedTags() error', err)));

            let includedTags = [];
            let allTags = [];

            let nameTags = this.getIncludedTagsFromText(user.twitelo.name.content);
            let descriptionTags = this.getIncludedTagsFromText(user.twitelo.description.content);
            let locationTags = this.getIncludedTagsFromText(user.twitelo.location.content);

            if (!data) {
                let nameSize = await this.getProfileTextLength(user.id, user.twitelo.name.content, nameTags)
                    .catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t get name size', 'getProfileTextLength() error', err)));
                let descriptionSize = await this.getProfileTextLength(user.id, user.twitelo.description.content, descriptionTags)
                    .catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t get description size', 'getProfileTextLength() error', err)));
                let locationSize = await this.getProfileTextLength(user.id, user.twitelo.location.content, locationTags)
                    .catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t get location size', 'getProfileTextLength() error', err)));

                if (nameSize > config.constant.twitterLimits.name) reject(Server.fn.api.jsonError(400, 'Too many characters in name'));
                if (descriptionSize > config.constant.twitterLimits.description) reject(Server.fn.api.jsonError(400, 'Too many characters in description'));
                if (locationSize > config.constant.twitterLimits.location) reject(Server.fn.api.jsonError(400, 'Too many characters in location'));
            }

            if (user.switch && user.disabled < config.constant.disabledAfter) {
                if (user.twitelo.name.status) includedTags = _.concat(includedTags, nameTags);
                if (user.twitelo.description.status) includedTags = _.concat(includedTags, descriptionTags);
                if (user.twitelo.location.status) includedTags = _.concat(includedTags, locationTags);
            }

            allTags = _.concat(nameTags, descriptionTags, locationTags);

            // Remove duplicate tags
            includedTags = _.uniq(includedTags);
            allTags = _.uniq(allTags);

            // Set all tags to not included
            await Server.fn.dbMethods.tag.updateByUserID(user.id, {
                included: false
            }).catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t update user\'s tags', '[DB] updateIncludedTags() error', err)));

            // Set tags included tags to included
            await Server.fn.dbMethods.tag.updateByUserAndIDs(user.id, includedTags, {
                included: true
            }).catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t update user\'s tags', '[DB] updateIncludedTags() error', err)));

            if (data) resolve(data);
            else {
                // Get all tags in profile
                Server.fn.dbMethods.tag.getByUserAndIDs(user.id, allTags)
                    .then(tags => resolve({
                        tags,
                        profile: {
                            name: user.twitelo.name.content,
                            description: user.twitelo.description.content,
                            location: user.twitelo.location.content
                        }
                    })).catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t get user\'s tags', '[DB] updateIncludedTags() error', err)));
            }

        });
    },

    getIncludedTags(userID, profile) {
        return new Promise(async (resolve, reject) => {

            let allTags = [];

            let nameTags = this.getIncludedTagsFromText(profile.name);
            let descriptionTags = this.getIncludedTagsFromText(profile.description);
            let locationTags = this.getIncludedTagsFromText(profile.location);

            allTags = _.concat(nameTags, descriptionTags, locationTags);

            // Remove duplicate tags
            allTags = _.uniq(allTags);

            // Get all tags in profile
            Server.fn.dbMethods.tag.getByUserAndIDs(userID, allTags)
                .then(tags => resolve({
                    tags,
                    profile
                })).catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t get user\'s tags', '[DB] getIncludedTags() error', err)));

        });
    },

    getPreview(tags, profile, forTwitter) {
        function getProfileTextPreview(text, tags, forTwitter) {
            let mapObj = [];
            const myRegexp = /<{([^<>{} ]+?)}>/g;
            let match = myRegexp.exec(text);
            let gameTag, generator;

            while (match != null) {
                let tag = tags[match[1]];
                if (tag && tag.data) {
                    try {
                        gameTag = Server.gameTags[tag.game_id][tag.tag_id];
                        generator = Server.gameAPI[tag.game_id].generator[gameTag.generator];
                        if (forTwitter) mapObj[`<{${match[1]}}>`] = generator(gameTag, tag.data, tag.settings);
                        else mapObj[`<{${match[1]}}>`] = `<{${generator(gameTag, tag.data, tag.settings)}}>`;
                    } catch (error) {
                        __logError(`Error with generator or gameTag \`${tag.tag_id}\``, error);
                        mapObj[`<{${match[1]}}>`] = '';
                    }
                } else mapObj[`<{${match[1]}}>`] = '';
                match = myRegexp.exec(text);
            }
            if (Object.keys(mapObj).length > 0) {
                var re = new RegExp(Object.keys(mapObj).join('|').replace(/{/g, '\\{'), 'g');
                text = text.replace(re, (matched) => mapObj[matched]);
            }
            if (forTwitter) text = text.trim().replace(/</g, '').replace(/>/g, '');
            else text = text.trim();
            return text;
        }

        tags = _.keyBy(tags, 'id');

        profile.name = getProfileTextPreview(profile.name, tags, forTwitter) || '';
        profile.description = getProfileTextPreview(profile.description, tags, forTwitter) || '';
        profile.location = getProfileTextPreview(profile.location, tags, forTwitter) || '';

        if (forTwitter) {
            profile.name = profile.name.substr(0, config.constant.twitterLimits.name);
            profile.description = profile.description.substr(0, config.constant.twitterLimits.description);
            profile.location = profile.location.substr(0, config.constant.twitterLimits.location);
        }

        return Server.fn.api.jsonSuccess(200, profile);
    },

    deleteUserData(user) {
        return new Promise((resolve, reject) => {

            Server.fn.dbMethods.setting.deleteByUserID(user.id)
                .then(() => Server.fn.dbMethods.notification.deleteByUserID(user.id))
                .then(() => Server.fn.dbMethods.tag.deleteByUserID(user.id))
                .then(() => Server.fn.dbMethods.account.deleteByUserID(user.id))
                .then(() => resolve(user))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] deleteUserData() error', err)));

        });
    },

    deleteUser(user) {
        return new Promise((resolve, reject) => {

            Server.fn.dbMethods.user.delete(user.id)
                .then(() => resolve(Server.fn.api.jsonSuccess(200, true)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] deleteUser() error', err)));

        });
    },

    getLatestActiveUsers(limit) {
        return new Promise((resolve, reject) => {

            Server.fn.dbMethods.user.getLatestActive(limit)
                .then((users) => resolve(Server.fn.api.jsonSuccess(200, users)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] getLatestActiveUsers() error', err)));

        });
    },

    // Useless because Twitter Updater update active users every 1 min
    getUpdatedTwitterUser(twitterUsers) {
        return new Promise((resolve, reject) => {

            let users = [];
            const usersIDs = twitterUsers.map(user => user.twitter_id);

            if (usersIDs.length > 0) {
                Server.twitterAPI.get('/users/lookup', {
                    user_id: usersIDs.join(','),
                    include_entities: false,
                    tweet_mode: false
                }, (err, twUsers) => {
                    if (err) reject(Server.fn.api.jsonError(500, 'Internal server error', '[TWITTER] getUpdatedTwitterUser() error', err));
                    else {
                        for (const twUser of twUsers) {
                            users.push({
                                twitter_id: twUser.id_str,
                                username: twUser.screen_name,
                                name: twUser.name,
                                profile_image_url: twUser.profile_image_url_https
                            });
                        }
                        resolve(Server.fn.api.jsonSuccess(200, users));
                    }
                });
            } else resolve(Server.fn.api.jsonSuccess(200, []));

        });
    },

};