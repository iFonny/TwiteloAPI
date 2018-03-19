module.exports = {
	router: function (express, routeName) {
		const router = express.Router();

		// middleware that is specific to this router
		router.use((req, res, next) => {
			next();
		});

		// define the home page route
		router.get('/', (req, res) => {
			res.status(200).json({
				coucou: 'oui'
			});
			//res.send(`Home for /${routeName}`);
		});

		// define the about route
		router.get('/about', (req, res) => {
			res.send(`/about page for /${routeName}`);
		});

		return router;
	}
};