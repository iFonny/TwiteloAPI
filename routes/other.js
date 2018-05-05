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
		//     Other routes                                                      //
		//=======================================================================//


		/* Contact me  */
		router.post('/contact', Server.limiter({
			expire: 1000 * 30, // 30 secondes
			lookup: ['connection.remoteAddress'],
			total: 1
		}), (req, res) => {
			Server.fn.routes.other.checkParamsContact(req.body, req.user)
				.then((data) => Server.fn.routes.other.contactMe(data))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		router.get('/donations', Server.cache.route({
			expire: {
				200: 1 * 60, // 1 minutes
				xxx: 1
			}
		}), (req, res) => {
			Server.fn.routes.other.getDonations()
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		router.get('/stats/min', Server.cache.route({
			expire: {
				200: 10 * 60, // 10 minutes
				xxx: 1
			}
		}), (req, res) => {
			Server.fn.routes.other.getStatsMin()
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});


		//=======================================================================//
		//     Me routes                                                         //
		//=======================================================================//

		const routerMe = express.Router();

		// middleware
		routerMe.use((req, res, next) => {

			// Check user permissions
			Server.fn.api.checkUserAuthorization('ALL', req.headers.authorization)
				.then((user) => {
					req.user = user;
					next();
				}) // Go to the routes
				.catch((err) => res.status(err.status).json(err));
		});

		/* Contact route */
		routerMe.post('/contact', Server.limiter({
			expire: 1000 * 30, // 30 secondes
			lookup: ['user.id'],
			total: 1
		}), (req, res) => {
			Server.fn.routes.other.checkParamsContact(req.body, req.user)
				.then((data) => Server.fn.routes.other.contactMe(data))
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