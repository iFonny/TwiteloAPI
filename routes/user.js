module.exports = {
	// router(express, routeName)
	router: function (express, routeName) {
		const router = express.Router();

		// middleware that is specific to this router
		router.use((req, res, next) => {

			// No auth
			next();
		});

		//=======================================================================//
		//     user routes                                                       //
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

		/* Get user */
		routerMe.get('/', (req, res) => {
			Server.fn.routes.user.getUser(req.user.id)
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Say welcome to the user and get stats (+log) */
		routerMe.get('/welcome', (req, res) => {
			Server.fn.routes.user.getStats(req.user, true)
				.then((stats) => Server.fn.api.sendWelcomeJoinLeave(stats, req.user))
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

		/* Save twitelo profile */
		routerMe.post('/save/profile', Server.limiter({
			expire: 5000, // 5 seconds
			lookup: ['user.id'],
			total: 5
		}), (req, res) => {
			Server.fn.routes.user.checkParamsSaveProfile(req.body)
				.then((profile) => Server.fn.routes.user.updateProfile(req.user, profile))
				.then((user) => Server.fn.routes.user.updateIncludedTags(user))
				.then((data) => Server.fn.routes.user.getPreview(data.tags, data.profile, false))
				.then((data) => __logUserAction(`__${routeName}__ - **@${req.user.username}** vient de sauvegarder son profil :pencil:`, data))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Get profile preview */
		routerMe.post('/preview', Server.limiter({
			expire: 5000, // 5 seconds
			lookup: ['user.id'],
			total: 5
		}), (req, res) => {
			Server.fn.routes.user.checkParamsSaveProfile(req.body)
				.then((profile) => Server.fn.routes.user.getIncludedTags(req.user.id, profile))
				.then((data) => Server.fn.routes.user.getPreview(data.tags, data.profile, false))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Delete user */
		routerMe.delete('/delete', (req, res) => {
			Server.fn.routes.user.getUser(req.user.id)
				.then((user) => Server.fn.routes.user.deleteUserData(user))
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
		//     No auth routes                                                    //
		//=======================================================================//

		/* Get latest user */
		router.get('/latest', Server.cache.route({
			expire: {
				200: 600, // 10 minutes
				xxx: 1
			}
		}), (req, res) => {
			Server.fn.routes.user.getLatestActiveUsers(10)
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});


		//=======================================================================//
		//     Other routes                                                      //
		//=======================================================================//




		return router;
	}
};