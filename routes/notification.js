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
		//     Notifications routes                                              //
		//=======================================================================//

		const routerMe = express.Router();

		// middleware
		routerMe.use((req, res, next) => {
			next();
		});

		/* Get all notifications */
		routerMe.get('/all', (req, res) => {
			Server.fn.routes.notification.getAllNotifications(req.user.id)
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Get all notifications (with limit) */
		routerMe.get('/all/limit/:limit', (req, res) => {
			Server.fn.routes.notification.checkParamsNotificationLimit(req.params)
				.then((limit) => Server.fn.routes.notification.getAllNotifications(req.user.id, limit))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Get unarchived notifications */
		routerMe.get('/unarchived', (req, res) => {
			Server.fn.routes.notification.getUnarchivedNotifications(req.user.id)
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Get unarchived notifications (with limit) */
		routerMe.get('/unarchived/limit/:limit', (req, res) => {
			Server.fn.routes.notification.checkParamsNotificationLimit(req.params)
				.then((limit) => Server.fn.routes.notification.getUnarchivedNotifications(req.user.id, limit))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Mark notificiations as archived (will only archive owned notifs) */
		routerMe.post('/archive', (req, res) => {
			Server.fn.routes.notification.checkParamsNotificationIDs(req.body)
				.then((notificationIDs) => Server.fn.routes.notification.archiveNotifications(req.user.id, notificationIDs))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Mark notificiations as unarchived (will only unarchived owned notifs) */
		routerMe.post('/unarchive', (req, res) => {
			Server.fn.routes.notification.checkParamsNotificationIDs(req.body)
				.then((notificationIDs) => Server.fn.routes.notification.unarchiveNotifications(req.user.id, notificationIDs))
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