//=======================================================================//
//     API functions                                                     //
//=======================================================================//

module.exports = {

  jsonError(status, publicMessage, message, err) {
    if (err) __logError(message, err);
    return ({
      status,
      data: publicMessage
    });
  },

  jsonSuccess(status, data) {
    return ({
      status,
      data,
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

  sendWelcomeJoinLeave(stats) {
    if (stats.join) {

      // TODO: follow @TwiteloFR
      // TODO: send message de bienvenue twitter (MP)
      Server.fn.db.log('join', `New user: @${stats.username}`);
    } else {
      Server.fn.db.log('leave', `Delete user: @${stats.username}`);
    }

    return Promise.resolve(Server.fn.api.jsonSuccess(200, __logJoinLeave(stats)));
  }

};