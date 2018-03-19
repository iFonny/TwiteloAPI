module.exports = {
	// router(express, routeName)
	router: function (express) {
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
		//     Trigger routes                                                    //
		//=======================================================================//

		/* Get triggers */
		router.get('/', (req, res) => {
			Server.fn.routes.trigger.getAllTriggers()
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Get triggers by game */
		router.get('/game/:gameID', (req, res) => {
			Server.fn.routes.trigger.checkParamsTriggerByGame(req.params)
				.then((gameID) => Server.fn.routes.trigger.getAllTriggersByGame(gameID))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		//=======================================================================//
		//     Other routes                                                      //
		//=======================================================================//


		return router;
	}
};