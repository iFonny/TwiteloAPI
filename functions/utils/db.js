//=======================================================================//
//     DB functions                                                      //
//=======================================================================//

module.exports = {

  async checkOrCreateTable() {
    try {
      await r.dbList().run().then(async (databases) => {
        if (!databases.includes(config.db.name)) {
          await r.dbCreate(config.db.name);
          __logInfo(`RethinkDB: '${config.db.name}' db created.`);
        }

        await r.tableList().run().then(async (tables) => {
          if (!tables.includes('user')) {
            await r.tableCreate('user').run().then(async () => {
              __logInfo('RethinkDB: "user" table created.');
              await r.table('user').indexCreate('twitter_id').run();
              await r.table('user').indexCreate('username').run();
              await r.table('user').indexCreate('twitelo_token').run();
              await r.table('user').indexCreate('api_key').run();
              await r.table('user').indexCreate('created').run();
              await r.table('user').indexCreate('updated').run();
              __logInfo('RethinkDB: "user" indexes created.');
            });
          }
          if (!tables.includes('deleted_user')) {
            await r.tableCreate('deleted_user').run().then(async () => {
              __logInfo('RethinkDB: "deleted_user" table created.');
              await r.table('deleted_user').indexCreate('twitter_id').run();
              await r.table('deleted_user').indexCreate('username').run();
              await r.table('deleted_user').indexCreate('twitelo_token').run();
              await r.table('deleted_user').indexCreate('api_key').run();
              await r.table('deleted_user').indexCreate('created').run();
              await r.table('deleted_user').indexCreate('updated').run();
              __logInfo('RethinkDB: "deleted_user" indexes created.');
            });
          }
          if (!tables.includes('notification')) {
            await r.tableCreate('notification').run().then(async () => {
              __logInfo('RethinkDB: "notification" table created.');
              await r.table('notification').indexCreate('destination').run();
              __logInfo('RethinkDB: "notification" indexes created.');
            });
          }
          if (!tables.includes('trigger')) {
            await r.tableCreate('trigger').run().then(async () => {
              __logInfo('RethinkDB: "trigger" table created.');
              await r.table('trigger').indexCreate('game_id').run();
              __logInfo('RethinkDB: "trigger" indexes created.');
            });
          }
          if (!tables.includes('setting')) {
            await r.tableCreate('setting').run().then(async () => {
              __logInfo('RethinkDB: "setting" table created.');
              await r.table('setting').indexCreate('user_id').run();
              await r.table('setting').indexCreate('type').run();
              await r.table('setting').indexCreate('trigger_id').run();
              __logInfo('RethinkDB: "setting" indexes created.');
            });
          }
          if (!tables.includes('log')) {
            await r.tableCreate('log').run();
            __logInfo('RethinkDB: "log" table created.');
          }
          if (!tables.includes('tag')) {
            await r.tableCreate('tag').run().then(async () => {
              __logInfo('RethinkDB: "tag" table created.');
              await r.table('tag').indexCreate('user_id').run();
              await r.table('tag').indexCreate('game_id').run();
              await r.table('tag').indexCreate('tag_id').run();
              await r.table('tag').indexCreate('account_id').run();
              await r.table('tag').indexCreate('created').run();
              await r.table('tag').indexCreate('updated').run();
              __logInfo('RethinkDB: "tag" indexes created.');
            });
          }
          if (!tables.includes('account')) {
            await r.tableCreate('account').run().then(async () => {
              __logInfo('RethinkDB: "account" table created.');
              await r.table('account').indexCreate('user_id').run();
              await r.table('account').indexCreate('game_id').run();
              await r.table('account').indexCreate('created').run();
              __logInfo('RethinkDB: "account" indexes created.');
            });
          }
          if (!tables.includes('game_data')) {
            await r.tableCreate('game_data').run().then(async () => {
              __logInfo('RethinkDB: "game_data" table created.');
              await r.table('game_data').indexCreate('game_id').run();
              await r.table('game_data').indexCreate('tag_id').run();
              await r.table('game_data').indexCreate('updated').run();
              __logInfo('RethinkDB: "game_data" indexes created.');
            });
          }
          if (!tables.includes('contact')) {
            await r.tableCreate('contact').run().then(async () => {
              __logInfo('RethinkDB: "contact" table created.');
              await r.table('contact').indexCreate('type').run();
              await r.table('contact').indexCreate('username').run();
              await r.table('contact').indexCreate('created').run();
              __logInfo('RethinkDB: "contact" indexes created.');
            });
          }
          if (!tables.includes('donation')) {
            await r.tableCreate('donation').run().then(async () => {
              __logInfo('RethinkDB: "donation" table created.');
              await r.table('donation').indexCreate('name').run();
              await r.table('donation').indexCreate('from').run();
              await r.table('donation').indexCreate('address').run();
              __logInfo('RethinkDB: "donation" indexes created.');
            });
          }
        });
      });
    } catch (e) {
      __logError(e);
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