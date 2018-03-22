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
			Server.fn.routes.game.getAllGames()
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Get games (without settings) */
		router.get('/min', (req, res) => {
			Server.fn.routes.game.getAllGamesMin()
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		//=======================================================================//
		//     Other routes                                                      //
		//=======================================================================//


		return router;
	}
};