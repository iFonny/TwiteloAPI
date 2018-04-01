module.exports = {
	// router(express, routeName)
	router: function (express, routeName) {
		const router = express.Router();

		// middleware that is specific to this router
		router.use((req, res, next) => {

			// Check user permissions
			Server.fn.api.checkUserAuthorization('ALL', req.headers.authorization)
				.then((user) => {
					req.user = user;
					next();
				}) // Go to the routes
				.catch((err) => res.status(err.status).json(err));
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
			Server.fn.routes.account.getAll(req.user.id) // TODO
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Get account by id */
		routerMe.get('/:id', (req, res) => {
			Server.fn.routes.account.checkParamsAccountID(req.params)
				.then((id) => Server.fn.routes.account.getAccount(req.user.id, id)) // TODO
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Create an account */
		routerMe.put('/create', Server.limiter({
			expire: 1000 * 60, // 1 minute
			lookup: function (req, res, opts, next) {
				opts.lookup = ['user.id', 'body.game_id'];

				switch (req.body.game_id) {
					case 'lol':
						opts.total = 5;
						break;

					case 'speedrun':
						opts.total = 2;
						break;

					default:
						opts.total = 5;
						break;
				}
				return next();
			}
		}), (req, res) => {
			Server.fn.routes.account.checkParamsAccountCreate(req.body)
				.then((account) => Server.fn.routes.account.getAccountID(req.user.id, account))
				.then((account) => Server.fn.routes.account.createAccount(account))
				.then((account) => Server.fn.routes.account.updateAccountGameData(account))
				.then((data) => __logUserAction(`__${routeName}__ - **@${req.user.username}** vient d'ajouter :heavy_plus_sign: un compte **${data.data.game_id}** : \`${data.data.settings.username}\``, data))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});


		/* Edit account settings */
		routerMe.post('/:id/edit', Server.limiter({
			expire: 1000 * 60, // 1 minute
			lookup: function (req, res, opts, next) {
				opts.lookup = ['user.id', 'body.game_id'];

				switch (req.body.game_id) {
					case 'lol':
						opts.total = 5;
						break;

					case 'speedrun':
						opts.total = 2;
						break;

					default:
						opts.total = 5;
						break;
				}
				return next();
			}
		}), (req, res) => {
			Server.fn.routes.account.checkParamsAccountUpdateSettings(req.body, req.params)
				.then((account) => Server.fn.routes.account.getAccountID(req.user.id, account))
				.then((account) => Server.fn.routes.account.updateAccountSettings(req.user.id, account)) // TODO
				.then((data) => __logUserAction(`__${routeName}__ - **@${req.user.username}** vient d'editer :pencil: un compte **${req.body.game_id}** : \`${req.body.settings.username}\``, data))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});



		/* Delete an account */
		routerMe.delete('/:id/delete', (req, res) => {
			// TODO
			Server.fn.routes.account.checkParamsAccountID(req.params)
				.then((id) => Server.fn.routes.account.deleteTagsWithThisAccountFromProfile(req.user, id)) // TODO
				.then((id) => Server.fn.routes.account.deleteAccount(req.user.id, id)) // TODO
				.then((data) => __logUserAction(`__${routeName}__ - **@${req.user.username}** a supprimé un compte`, data))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		router.use('/me', routerMe);


		//=======================================================================//
		//     Other routes                                                      //
		//=======================================================================//


		return router;
	}
};