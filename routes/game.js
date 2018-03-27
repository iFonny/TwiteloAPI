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

		/* Get games (without settings) */
		router.get('/min', (req, res) => {
			Server.fn.routes.game.getEnabledGamesMin()
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		//=======================================================================//
		//     Tag routes                                                        //
		//=======================================================================//

		const routerTags = express.Router();

		// middleware
		routerTags.use((req, res, next) => {
			next();
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