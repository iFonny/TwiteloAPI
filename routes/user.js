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
		//     user routes                                                       //
		//=======================================================================//

		const routerMe = express.Router();

		// middleware
		routerMe.use((req, res, next) => {
			next();
		});

		/* Get user */
		routerMe.get('/', (req, res) => {
			Server.fn.routes.user.getUser(req.user.id)
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Say welcome to the user and get stats (+log) */
		routerMe.get('/welcome', (req, res) => {
			Server.fn.routes.user.getStats(req.user, true)
				.then((stats) => Server.fn.api.sendWelcomeJoinLeave(stats))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Get and update user */
		routerMe.get('/update', (req, res) => {
			Server.fn.routes.user.getTwitterUserData(req.user)
				.then((twitterData) => Server.fn.routes.user.updateUser(req.user.id, twitterData))
				.then(() => Server.fn.routes.user.getUser(req.user.id))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Delete user */
		routerMe.delete('/', (req, res) => {
			Server.fn.routes.user.getUser(req.user.id)
				.then((user) => Server.fn.routes.user.deleteUser(user.data))
				.then((data) => __logUserAction(`__${routeName}__ - **@${req.user.username}** vient de supprimer son compte :wastebasket:`, data))
				.then(() => Server.fn.routes.user.getStats(req.user, false))
				.then((stats) => Server.fn.api.sendWelcomeJoinLeave(stats))
				.then(() => res.status(200).json({
					status: 200,
					data: true
				}))
				.catch((err) => res.status(err.status).json(err));
		});

		router.use('/me', routerMe);


		//=======================================================================//
		//     Other routes                                                      //
		//=======================================================================//


		return router;
	}
};