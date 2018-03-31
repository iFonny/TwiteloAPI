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
		//     Settings routes                                                   //
		//=======================================================================//

		const routerMe = express.Router();

		// middleware
		routerMe.use((req, res, next) => {
			next();
		});

		/* Get all settings */
		routerMe.get('/all', (req, res) => {
			Server.fn.routes.setting.getAllSettings(req.user.id)
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Create an empty ppTrigger */
		routerMe.put('/pp_trigger/empty', (req, res) => {
			Server.fn.routes.setting.createEmptyPPTriggerSetting(req.user.id)
				.then((data) => __logUserAction(`__${routeName}__ - **@${req.user.username}** vient de creer un déclencheur de photo de profil vide`, data))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Change locale */
		routerMe.post('/user/locale/:locale', (req, res) => {
			Server.fn.routes.setting.checkParamsLocale(req.params)
				.then((locale) => Server.fn.routes.setting.updateSetting(req.user.id, 'locale', locale))
				.then((data) => __logUserAction(`__${routeName}__ - **@${req.user.username}** vient de changer sa locale ${data.data == 'en' ? ':flag_gb:' : `:flag_${data.data}:` }`, data))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Toggle global switch */
		routerMe.post('/switch/global/:status', (req, res) => {
			Server.fn.routes.setting.checkParamsSwitchStatus(req.params)
				.then((status) => Server.fn.routes.setting.updateUserGlobalSwitch(req.user.id, status))
				.then((data) => __logUserAction(`__${routeName}__ - **@${req.user.username}** ${parseInt(req.params.status, 2) ? ':radio_button:' : ':red_circle:'} Twitelo (global switch)`, data))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Toggle twitelo switch */
		routerMe.post('/switch/twitelo/:name/:status', (req, res) => {
			Server.fn.routes.setting.checkParamsSwitchNameStatus(req.params)
				.then((params) => Server.fn.routes.setting.updateTwiteloSwitch(req.user.id, params.name, params.status))
				.then((data) => __logUserAction(`__${routeName}__ - **@${req.user.username}** ${parseInt(req.params.status, 2) ? ':radio_button:' : ':red_circle:'} update auto de **${req.params.name}**`, data))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Toggle notification switch */
		routerMe.post('/switch/notification/:name/:status', (req, res) => {
			Server.fn.routes.setting.checkParamsSwitchNameStatus(req.params)
				.then((params) => Server.fn.routes.setting.updateNotificationSwitch(req.user.id, params.name, params.status))
				.then((data) => __logUserAction(`__${routeName}__ - **@${req.user.username}** ${parseInt(req.params.status, 2) ? ':radio_button:' : ':red_circle:'} update auto de **${req.params.name}**`, data))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Toggle pp_trigger switch */
		routerMe.post('/switch/pp_trigger/:status', (req, res) => {
			Server.fn.routes.setting.checkParamsSwitchStatus(req.params)
				.then((status) => Server.fn.routes.setting.updateSetting(req.user.id, 'pp_trigger', status))
				.then((data) => __logUserAction(`__${routeName}__ - **@${req.user.username}** ${parseInt(req.params.status, 2) ? ':radio_button:' : ':red_circle:'} update auto des **images de profil**`, data))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Edit ppTrigger */
		routerMe.post('/pp_trigger/edit', (req, res) => {
			Server.fn.routes.setting.checkParamsEditPPTrigger(req.body)
				.then((ppTrigger) => Server.fn.routes.setting.updatePPTrigger(req.user.id, ppTrigger))
				.then((data) => __logUserAction(`__${routeName}__ - **@${req.user.username}** a modifié un declencheur d'image de profil ${data.data.trigger_id ? `**(${data.data.trigger_id})**` : ''}`, data))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Delete ppTriggers */
		routerMe.delete('/pp_trigger/delete', (req, res) => {
			Server.fn.routes.setting.checkParamsPPTriggerIDs(req.body)
				.then((ppTriggerIDs) => Server.fn.routes.setting.deletePPTriggers(req.user.id, ppTriggerIDs))
				.then((data) => __logUserAction(`__${routeName}__ - **@${req.user.username}** a supprimé des images de profil`, data))
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