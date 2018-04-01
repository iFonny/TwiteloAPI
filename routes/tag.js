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
		//     tag routes                                                        //
		//=======================================================================//

		const routerMe = express.Router();

		// middleware
		routerMe.use((req, res, next) => {
			next();
		});

		/* Get all tags */
		routerMe.get('/all', (req, res) => {
			Server.fn.routes.tag.getAll(req.user.id)
				.then((tags) => Server.fn.routes.tag.addInfo(tags, true))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});

		/* Get tags by game */
		routerMe.get('/game/:gameID', (req, res) => {
			// TODO
		});

		/* Get tag by id */
		routerMe.get('/:id', (req, res) => {
			// TODO
		});



		/* Create a tag */
		routerMe.put('/create', (req, res) => {
			Server.fn.routes.tag.checkParamsTagCreate(req.body)
				.then((data) => Server.fn.routes.tag.createTag(req.user.id, data))
				.then((tag) => Server.fn.routes.tag.addInfo(tag, false))
				.then((data) => __logUserAction(`__${routeName}__ - **@${req.user.username}** vient d'ajouter :heavy_plus_sign: un tag : \`${data.data.tag_id}\``, data))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});



		/* Edit a tag */
		routerMe.post('/:id/edit', (req, res) => {
			Server.fn.routes.tag.checkParamsTagUpdateSettings(req.body, req.params)
				.then((tag) => Server.fn.routes.tag.updateTagSettings(req.user.id, tag))
				.then((data) => __logUserAction(`__${routeName}__ - **@${req.user.username}** vient d'editer :pencil: un tag : \`${req.body.tag_id}\``, data))
				.then((data) => res.status(data.status).json(data))
				.catch((err) => res.status(err.status).json(err));
		});



		/* Delete a tag */
		routerMe.delete('/:id/delete', (req, res) => {
			Server.fn.routes.tag.checkParamsTagID(req.params)
				.then((id) => Server.fn.routes.tag.deleteTagFromProfile(req.user, id))
				.then((id) => Server.fn.routes.tag.deleteTag(req.user.id, id))
				.then((data) => __logUserAction(`__${routeName}__ - **@${req.user.username}** a supprimé un tag`, data))
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