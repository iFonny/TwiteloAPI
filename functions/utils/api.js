//=======================================================================//
//     API functions                                                     //
//=======================================================================//

module.exports = {

  jsonError(status, publicMessage, message, err) {
    if (err) __logError(message, err);
    return ({
      status: status,
      data: publicMessage
    });
  },

  jsonSuccess(status, data) {
    return ({
      status: status,
      data: data,
    });
  },

  /*
   ** role : 'all' or 'ROLE' or ['role1', 'role2']
   */
  checkUserAuthorization(roles, twiteloToken) {
    return new Promise((resolve, reject) => {

      if (!roles || (typeof roles == 'string' && roles.toLowerCase() == 'all')) roles = config.constant.roles;
      if (typeof roles == 'string') roles = [roles.toUpperCase()];

      if (twiteloToken) {
        Server.fn.db.checkAuth(roles, twiteloToken)
          .then((user) => {
            user.tokens = Server.jwt.decode(user.tokens, config.secret.jwtSecret);
            resolve(user);
          }) // decode tokens && resolve user
          .catch((err) => {
            if (err) reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] checkAuth() error', err));
            else reject((Server.fn.api.jsonError(403, 'Forbidden')));
          });
      } else return reject((Server.fn.api.jsonError(400, 'twiteloToken missing')));
    });

  },

  sendWelcomeJoinLeave(stats, user) {
    if (stats.join) {

      var client = new Server.Twitter({
        consumer_key: config.secret.twitter.consumerKey,
        consumer_secret: config.secret.twitter.consumerSecret,
        access_token_key: user.tokens.token,
        access_token_secret: user.tokens.tokenSecret
      });

      if (user.twitter_id != config.secret.twitter.twiteloID) {
        client.post('friendships/create', {
          user_id: config.secret.twitter.twiteloID
        }, (error) => {
          if (error) __logWarning(`[WELCOME] Can't follow @${user.username}`, error);

          let welcomeMessage = '';
          if (user.settings.locale == 'fr') welcomeMessage = 'Bienvenue !\n\nEmbellissez votre description, nom, localisation twitter avec vos stats et montrez votre skill (ou pas) !\nVous pouvez activer/désactiver la modification automatique ici: : https://twitelo.me/settings (ou en envoyant  "ON"|"OFF" ici)\n\nVous pouvez également nous rejoindre sur discord : http://discord.gg/F75CNy2\nContact: https://twitelo.me/contact';
          else welcomeMessage = 'Welcome!\n\nEmbellish your twitter description, name, location with your stats and show your skill (or not)!\nYou can enable/disable auto updater here : https://twitelo.me/settings (or by sending "ON"|"OFF" here)\n\nYou can also join us on discord: http://discord.gg/F75CNy2\nContact: https://twitelo.me/contact';

          Server.twitterBot.post('direct_messages/new', {
            user_id: user.twitter_id,
            text: welcomeMessage
          }, (errorMP) => {
            if (errorMP) __logWarning(`[WELCOME] Can't send MP to @${user.username}`, errorMP);
          });
        });
      }

      Server.fn.db.log('join', `New user: @${stats.username}`);
    } else {
      Server.fn.db.log('leave', `Delete user: @${stats.username}`);
    }

    return Promise.resolve(Server.fn.api.jsonSuccess(200, __logJoinLeave(stats)));
  },

  getAndUpdateGameData(game) {
    return new Promise((resolve, reject) => {
      Server.fn.dbMethods.tag.getTagsToUpdate(game.id, game.ratelimit.total)
        .then((results) => {

          let tagsToUpdate = [];

          for (const result of results) {
            let tagToUpdate = {
              game_id: result.group[0],
              data_settings: result.group[1],
              game_account_info: result.group[2],
              tag_ids: {}
            };

            for (const tag of result.reduction) {
              tagToUpdate.tag_ids[tag.tag_id] = true;
            }

            tagsToUpdate.push(tagToUpdate);
          }

          if (tagsToUpdate.length <= 0) return resolve(null);
          else {
            Server.gameAPI[game.id].updateFullGameData(game, tagsToUpdate)
              .then((recap) => {
                Server.ratelimitCounters[game.id] = {
                  reqCounter: 0,
                  totalRequests: 0,
                  totalTags: 0
                };
                return resolve(recap);
              });
          }

        })
        .catch(reject);
    });
  }

};