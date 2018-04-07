module.exports = {
	// router(express, routeName)
	router: function (express) {
		const router = express.Router();

		// middleware that is specific to this router
		router.use((req, res, next) => {

			// No auth
			next();
		});

		//=======================================================================//
		//     Game routes                                                       //
		//=======================================================================//

		/* Get games */
		router.get('/', (req, res) => {
			Server.fn.routes.game.getGames()
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Get a game */
		router.get('/:gameID', (req, res) => {
			Server.fn.routes.game.checkParamsGameID(req.params)
				.then((game) => Server.fn.routes.game.getGame(game))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		//=======================================================================//
		//     Tag routes                                                        //
		//=======================================================================//

		const routerTags = express.Router();

		// middleware
		routerTags.use((req, res, next) => {
			// Check user permissions
			Server.fn.api.checkUserAuthorization('ALL', req.headers.authorization)
				.then((user) => {
					req.user = user;
					next();
				}) // Go to the routes
				.catch((err) => res.status(err.status).json(err));
		});

		/* Get all game tags */
		routerTags.get('/all', Server.cache.route({
			expire: {
				200: 6000, // 100 minutes
				xxx: 1
			}
		}), (req, res) => {
			Server.fn.routes.game.getAllTags()
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Get game tags by game */
		routerTags.get('/game/:gameID', Server.cache.route({
			expire: {
				200: 6000, // 100 minutes
				xxx: 1
			}
		}), (req, res) => {
			Server.fn.routes.game.checkParamsTagByGame(req.params)
				.then((gameID) => Server.fn.routes.game.getTagsByGame(gameID))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});


		router.use('/tags', routerTags);

		//=======================================================================//
		//     Settings routes                                                   //
		//=======================================================================//

		const routerSettings = express.Router();

		// middleware
		routerSettings.use((req, res, next) => {

			// Check user permissions
			Server.fn.api.checkUserAuthorization('ALL', req.headers.authorization)
				.then((user) => {
					req.user = user;
					next();
				}) // Go to the routes
				.catch((err) => res.status(err.status).json(err));
		});

		/* Get all game settings */
		routerSettings.get('/all', Server.cache.route({
			expire: {
				200: 6000, // 100 minutes
				xxx: 1
			}
		}), (req, res) => {
			Server.fn.routes.game.getAllSettings()
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Get game settings by game */
		routerSettings.get('/game/:gameID', Server.cache.route({
			expire: {
				200: 6000, // 100 minutes
				xxx: 1
			}
		}), (req, res) => {
			Server.fn.routes.game.checkParamsTagByGame(req.params)
				.then((gameID) => Server.fn.routes.game.getSettingsByGame(gameID))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		router.use('/settings', routerSettings);

		//=======================================================================//
		//     Other routes                                                      //
		//=======================================================================//


		return router;
	}
};