const config = {
	env: 'dev',
	server: {
		name: 'api-dev',
		url: 'localhost:3032',
		host: 'localhost',
		appURL: 'localhost',
		websiteURL: 'http://localhost:3032',
		port: 3032
	},
	media: {
		url: 'http://localhost:3032/public/media',
		path: {
			root: '/public/media/dev'
		}
	},
	logs: {
		discord: true
	},
	db: {
		name: 'twitelo_dev'
	}
};

// Exports module
module.exports = config;