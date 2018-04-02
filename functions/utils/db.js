//=======================================================================//
//     DB functions                                                      //
//=======================================================================//

module.exports = {

  checkOrCreateTable() {
    try {
      r.tableList().run().then((tables) => {
        if (!tables.includes('user')) {
          __logInfo('RethinkDB: "user" table created.');
          r.tableCreate('user').run().then(() => {
            r.table('user').indexCreate('twitter_id').run();
            r.table('user').indexCreate('username').run();
            r.table('user').indexCreate('twitelo_token').run();
            r.table('user').indexCreate('api_key').run();
            r.table('user').indexCreate('created').run();
            r.table('user').indexCreate('updated').run();
            __logInfo('RethinkDB: "user" indexes created.');
          });
        }
        if (!tables.includes('deleted_user')) {
          __logInfo('RethinkDB: "deleted_user" table created.');
          r.tableCreate('deleted_user').run().then(() => {
            r.table('deleted_user').indexCreate('twitter_id').run();
            r.table('deleted_user').indexCreate('username').run();
            r.table('deleted_user').indexCreate('twitelo_token').run();
            r.table('deleted_user').indexCreate('api_key').run();
            r.table('deleted_user').indexCreate('created').run();
            r.table('deleted_user').indexCreate('updated').run();
            __logInfo('RethinkDB: "deleted_user" indexes created.');
          });
        }
        if (!tables.includes('notification')) {
          __logInfo('RethinkDB: "notification" table created.');
          r.tableCreate('notification').run().then(() => {
            r.table('notification').indexCreate('destination').run();
            __logInfo('RethinkDB: "notification" indexes created.');
          });
        }
        if (!tables.includes('trigger')) {
          __logInfo('RethinkDB: "trigger" table created.');
          r.tableCreate('trigger').run().then(() => {
            r.table('trigger').indexCreate('game_id').run();
            __logInfo('RethinkDB: "trigger" indexes created.');
          });
        }
        if (!tables.includes('setting')) {
          __logInfo('RethinkDB: "setting" table created.');
          r.tableCreate('setting').run().then(() => {
            r.table('setting').indexCreate('user_id').run();
            r.table('setting').indexCreate('type').run();
            r.table('setting').indexCreate('trigger_id').run();
            __logInfo('RethinkDB: "setting" indexes created.');
          });
        }
        if (!tables.includes('log')) {
          __logInfo('RethinkDB: "log" table created.');
          r.tableCreate('log').run();
        }
        if (!tables.includes('tag')) {
          __logInfo('RethinkDB: "tag" table created.');
          r.tableCreate('tag').run().then(() => {
            r.table('tag').indexCreate('user_id').run();
            r.table('tag').indexCreate('game_id').run();
            r.table('tag').indexCreate('tag_id').run();
            r.table('tag').indexCreate('account_id').run();
            r.table('tag').indexCreate('created').run();
            __logInfo('RethinkDB: "tag" indexes created.');
          });
        }
        if (!tables.includes('account')) {
          __logInfo('RethinkDB: "account" table created.');
          r.tableCreate('account').run().then(() => {
            r.table('account').indexCreate('user_id').run();
            r.table('account').indexCreate('account_id').run();
            r.table('account').indexCreate('game_id').run();
            r.table('account').indexCreate('created').run();
            __logInfo('RethinkDB: "account" indexes created.');
          });
        }
      });
    } catch (e) {
      __logError('checkOrCreateTable() error', e);
    }
  },

  checkAuth(roles, twitelo_token) {
    return new Promise((resolve, reject) => {
      r.table('user')
        .filter({
          twitelo_token
        })
        .filter((doc) => r.expr(roles).contains(doc('role'))) // Check if user role is in 'roles'
        .run()
        .then((users) => users.length > 0 && users[0] ? resolve(users[0]) : reject())
        .catch(reject);
    });
  },

  log(action, content) {
    return new Promise((resolve) => {
      r.table('log')
        .insert({
          action,
          content,
          created: Date.now()
        })
        .run()
        .then(resolve)
        .catch(resolve);
    });
  }

};