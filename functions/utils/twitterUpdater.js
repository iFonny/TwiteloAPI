//=======================================================================//
//     Twitter updater functions                                         //
//=======================================================================//

module.exports = {

    update() {
        return new Promise((resolve, reject) => {

            let total = {
                updated: 0,
                notUpdated: 0
            };

            Server.fn.dbMethods.user.getUsersToUpdate()
                .then(async (users) => {

                    for (let user of users) {

                        // decode twitter tokens
                        user.tokens = Server.jwt.decode(user.tokens, config.secret.jwtSecret);

                        // Connect to twitter
                        const twitterUser = new Server.Twitter({
                            consumer_key: config.secret.twitter.consumerKey,
                            consumer_secret: config.secret.twitter.consumerSecret,
                            access_token_key: user.tokens.token,
                            access_token_secret: user.tokens.tokenSecret
                        });

                        // Get twitter profile
                        let profile = await Server.fn.routes.user.getIncludedTags(user.id, {
                                description: user.twitelo.description.content,
                                location: user.twitelo.location.content,
                                name: user.twitelo.name.content
                            })
                            .then((data) => Server.fn.routes.user.getPreview(data.tags, data.profile, true))
                            .then((data) => data.data)
                            .catch(reject);

                        // Delete disabled switch
                        if (!user.twitelo.name.status) delete profile.name;
                        if (!user.twitelo.description.status) delete profile.description;
                        if (!user.twitelo.location.status) delete profile.location;

                        profile.include_entities = false;
                        profile.skip_status = true;

                        console.log(profile);
                        
                        /*
                        twitterUser.post('account/update_profile', {location: Server.twitterText.htmlEscape('#hello < @world >')})
                            .then((result) => {
                                console.log(result);
                            })
                            .catch((error) => {
                                console.error(error);
                            });*/

                        //console.log(user);
                    }

                    //console.log(users);

                    // Connecter a twitter
                    // Get previews
                    // 4 if (name, desc, loc, url) et update en fonction

                    resolve(total);
                })
                .catch(err => reject(__logError('[DB] twitterUpdater - Can\'t get users to update'), err));
        });
    }

};