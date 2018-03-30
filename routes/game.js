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
			Server.fn.routes.game.getEnabledGames()
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

		/* Get all tags */
		routerTags.get('/', Server.cache.route({
			expire: {
				200: 6000, // 100 minutes
				xxx: 1
			}
		}), (req, res) => {
			Server.fn.routes.game.getAllTags()
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Get tags by game */
		routerTags.get('/:gameID', Server.cache.route({
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
		//     Other routes                                                      //
		//=======================================================================//


		return router;
	}
};