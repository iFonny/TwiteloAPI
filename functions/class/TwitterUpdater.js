//=======================================================================//
//     Twitter updater                                                   //
//=======================================================================//

module.exports = class twitterUpdater {
    constructor() {
        this.total = {
            updated: 0,
            notUpdated: 0
        };
        this.user = null;
    }

    update() {
        this.total.updated = 0;
        this.total.notUpdated = 0;
        this.user = null;

        const time = process.hrtime();
        __log('__**Twitter**__ - starting update...');

        return Server.fn.dbMethods.user.getUsersToUpdate()
            .then((users) => this.updateUsers(users))
            .then(() => {
                const elapsedTimeS = process.hrtime(time)[0];
                const elapsedTimeMS = process.hrtime(time)[1] / 1000000;
                __log(`__**Twitter**__ - update finished in **${elapsedTimeS}s ${elapsedTimeMS}ms**`);
                return __logRecapTwitter(`__**Twitter**__ - ${this.total.updated} users updated ${this.total.notUpdated ? `(${this.total.notUpdated} not updated) ` : ''}in **${elapsedTimeS}s**`);
            })
            .catch(err => __logError('[DB] twitterUpdater - Can\'t get users to update', err));
    }

    async updateUsers(users) {
        try {
            for (let user of users) {
                this.user = user;
                const twitterUser = this.connectToTwitter();
                await this.getTwitterProfileToUpdate()
                    .then((profile) => this.updateTwitterProfile(profile, twitterUser));
            }
        } catch (err) {
            return Promise.reject(err);
        }
    }

    connectToTwitter() {

        // decode twitter tokens
        this.user.tokens = Server.jwt.decode(this.user.tokens, config.secret.jwtSecret);

        // Connect to twitter
        return new Server.Twitter({
            consumer_key: config.secret.twitter.consumerKey,
            consumer_secret: config.secret.twitter.consumerSecret,
            access_token_key: this.user.tokens.token,
            access_token_secret: this.user.tokens.tokenSecret
        });
    }

    getTwitterProfileToUpdate() {

        // Get twitter profile
        return Server.fn.routes.user.getIncludedTags(this.user.id, {
                description: this.user.twitelo.description.content,
                location: this.user.twitelo.location.content,
                name: this.user.twitelo.name.content
            })
            .then((data) => Server.fn.routes.user.getPreview(data.tags, data.profile, true))
            .then((data) => data.data)
            .then((profile) => {

                // Delete disabled switch
                if (!this.user.twitelo.name.status) delete profile.name;
                if (!this.user.twitelo.description.status) delete profile.description;
                if (!this.user.twitelo.location.status) delete profile.location;

                profile.include_entities = false;
                profile.skip_status = true;

                return profile;
            });
    }


    updateTwitterProfile(profile, twitterUser) {
        return twitterUser.post('account/update_profile', profile)
            .then(twUser => this.profileUpdated(twUser))
            .catch(errors => this.profileNotUpdated(errors[0]));
    }

    profileUpdated(twUser) {
        this.total.updated += 1;

        return Server.fn.dbMethods.user.update(this.user.id, {
            username: twUser.screen_name,
            name: twUser.name,
            protected: twUser.protected,
            verified: twUser.verified,
            followers: twUser.followers_count,
            lang: twUser.lang,
            profile_image_url: twUser.profile_image_url_https.replace('_normal', '_400x400'),
            description: twUser.description,
            disabled: 0,
            updated: Date.now()
        }).catch(err => __logError('[DB] profileUpdated - Can\'t update user', err));
    }

    profileNotUpdated(error) {
        this.total.notUpdated += 1;

        if (error && error.code) {
            switch (error.code) {
                case 32:
                case 63:
                case 64:
                case 89:
                case 220:
                    return this.twiteloAppRevoked(error);
                case 120:
                    return this.profileUpdateFailed(error);
                default:
                    return __logError(`[Unknown] Can't update user @${this.user.username} (code: ${error.code})`, error);
            }
        } else __logError('[Unknown] Twitter update error', error);
    }

    twiteloAppRevoked(error) {
        this.user.disabled += 1;

        if (this.user.disabled >= config.constant.disabledAfter) {
            __logError(`Can't update user @${this.user.username} (code: ${error.code}) - Now disabled`, error);
            return Server.fn.dbMethods.user.update(this.user.id, {
                    disabled: this.user.disabled
                })
                .then(() => Server.fn.routes.user.updateIncludedTags(this.user, true))
                .then(() => Server.fn.dbMethods.notification.sendNotification(this.user.id, 'exclamation-circle', 'error', {
                    en: {
                        title: 'Twitter error',
                        content: 'Twitelo no longer has access to your account. If you want to continue using twitelo, please log in again (http://twitelo.me).'
                    },
                    fr: {
                        title: 'Erreur twitter',
                        content: 'Twitelo n\'a plus accès a votre compte. Si vous voulez continuer d\'utiliser twitelo, veuillez vous reconnecter (http://twitelo.me).'
                    }
                }))
                .catch(err => __logError('[DB] twitterUpdater - Can\'t update user/updateTags/sendNotif', err));
        } else {
            return Server.fn.dbMethods.user.update(this.user.id, {
                disabled: this.user.disabled
            }).catch(err => __logError('[DB] twitterUpdater - Can\'t update user', err));
        }
    }


    profileUpdateFailed(error) {
        __logError(`Can't update user @${this.user.username} (code: ${error.code})\n` +
            `- Name: ${this.user.twitelo.name.content}\n` +
            `- Description: ${this.user.twitelo.description.content}\n` +
            `- Location: ${this.user.twitelo.location.content}`, error);

        return Server.fn.dbMethods.user.update(this.user.id, {
                switch: false
            })
            .then(() => Server.fn.routes.user.updateIncludedTags(this.user, true))
            .then(() => Server.fn.dbMethods.notification.sendNotification(this.user.id, 'exclamation-circle', 'error', {
                en: {
                    title: 'Twitter error',
                    content: 'Unable to update your profile, the updater has been disabled. Please apply the necessary corrections before reactivating it.\n\n' +
                        error.message
                },
                fr: {
                    title: 'Erreur twitter',
                    content: 'Impossible de mettre à jour votre profil, l\'updater a donc été desactivé. Veuillez appliquer les corrections nécessaires avant de le réactiver.\n\n' +
                        error.message
                }
            }))
            .catch(err => __logError('[DB] twitterUpdater - Can\'t update user/updateTags/sendNotif', err));
    }
};