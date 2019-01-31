module.exports = {
  // router(express, routeName)
  router: function(express, routeName) {
    const router = express.Router();

    // middleware that is specific to this router
    router.use((req, res, next) => {
      // Check user permissions
      Server.fn.api
        .checkUserAuthorization('ALL', req.headers.authorization)
        .then(user => {
          req.user = user;
          next();
        }) // Go to the routes
        .catch(err => res.status(err.status).json(err));
    });

    //=======================================================================//
    //     Account routes                                                    //
    //=======================================================================//

    const routerMe = express.Router();

    // middleware
    routerMe.use((req, res, next) => {
      next();
    });

    /* Get all accounts */
    routerMe.get('/all', (req, res) => {
      Server.fn.routes.account
        .getAll(req.user.id) // TODO
        .then(data => res.status(data.status).json(data))
        .catch(err => res.status(err.status).json(err));
    });

    /* Get account by id */
    routerMe.get('/:id', (req, res) => {
      Server.fn.routes.account
        .checkParamsAccountID(req.params)
        .then(id => Server.fn.routes.account.getAccount(req.user.id, id)) // TODO
        .then(data => res.status(data.status).json(data))
        .catch(err => res.status(err.status).json(err));
    });

    /* Create an account */
    routerMe.put(
      '/create',
      Server.limiter({
        expire: 1000 * 60, // 1 minute
        lookup: function(req, res, opts, next) {
          opts.lookup = ['user.id', 'body.game_id'];
          opts.total = 5;
          return next();
        }
      }),
      (req, res) => {
        Server.fn.routes.account
          .checkParamsAccountCreate(req.body)
          .then(account => Server.fn.routes.account.getAccountID(req.user, account))
          .then(account => Server.fn.routes.account.createAccount(account))
          .then(data =>
            __logUserAction(
              `__${routeName}__ - **@${req.user.username}** vient d'ajouter :heavy_plus_sign: un compte **${data.data.game_id}** : \`${
                data.data.settings.username
              }\``,
              data
            )
          )
          .then(data => res.status(data.status).json(data))
          .catch(err => res.status(err.status).json(err));
      }
    );

    /* Edit account settings */
    routerMe.post(
      '/:id/edit',
      Server.limiter({
        expire: 1000 * 60, // 1 minute
        lookup: function(req, res, opts, next) {
          opts.lookup = ['user.id', 'body.game_id'];
          opts.total = 5;
          return next();
        }
      }),
      (req, res) => {
        Server.fn.routes.account
          .checkParamsAccountUpdateSettings(req.body, req.params)
          .then(account => Server.fn.routes.account.getAccountID(req.user, account))
          .then(account => Server.fn.routes.account.updateAccountSettings(req.user.id, account))
          .then(data =>
            __logUserAction(
              `__${routeName}__ - **@${req.user.username}** vient d'editer :pencil: un compte **${req.body.game_id}** : \`${
                req.body.settings.username
              }\``,
              data
            )
          )
          .then(data => res.status(data.status).json(data))
          .catch(err => res.status(err.status).json(err));
      }
    );

    /* Delete an account */
    routerMe.delete('/:id/delete', (req, res) => {
      Server.fn.routes.account
        .checkParamsAccountID(req.params)
        .then(id => Server.fn.routes.account.getTagsToDelete(req.user.id, id))
        .then(data => Server.fn.routes.account.deleteTagsFromProfile(req.user, data))
        .then(data => Server.fn.routes.account.deleteTagsAndAccount(req.user.id, data.account, data.tags))
        .then(data => __logUserAction(`__${routeName}__ - **@${req.user.username}** a supprimé un compte et tous les tags liés`, data))
        .then(data => res.status(data.status).json(data))
        .catch(err => res.status(err.status).json(err));
    });

    router.use('/me', routerMe);

    //=======================================================================//
    //     Other routes                                                      //
    //=======================================================================//

    /* Edit account settings */
    router.get('/v4migration', async (req, res) => {
      if (req.user.id == '6155ff1b-9276-416c-8abb-2c910ff4d099') {
        try {
          const accounts = await Server.fn.dbMethods.account.getAllWithFilter({ game_id: 'lol' });

          let counter = 0;

          for (const account of accounts) {
            const fakeUser = await Server.fn.dbMethods.user.get(account.user_id);

            await Server.fn.routes.account
              .getAccountID(fakeUser, account)
              .then(account => Server.fn.routes.account.updateAccountSettings(fakeUser.id, account))
              .then(() => console.log(`${account.settings.username} - ${account.settings.region} updated.`))
              .catch(async err => {
                if (typeof err == 'object' && err.status == 404) {
                  counter += 1;
                  console.log(`ERR: ${account.settings.username} - ${account.settings.region} invalid. (${account.id})`);
                  await Server.fn.routes.account
                    .getTagsToDelete(fakeUser.id, account.id)
                    .then(data => Server.fn.routes.account.deleteTagsFromProfile(fakeUser, data))
                    .then(data => Server.fn.routes.account.deleteTagsAndAccount(fakeUser.id, data.account, data.tags))
                    .catch(console.error);
                } else console.log(err);
              });
          }

          res.status(200).json({ res: counter });
        } catch (error) {
          console.error(error);
          res.status(500).json({ err: 'ono' });
        }
      } else res.status(500).json({ err: 'pas le droit xd' });
    });

    return router;
  }
};
