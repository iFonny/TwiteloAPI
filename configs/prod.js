const config = {
	env: 'prod',
	server: {
		name: 'api',
		url: 'localhost:3030',
		host: 'api.twitelo.me',
		appURL: 'https://twitelo.me',
		websiteURL: 'https://api.twitelo.me',
		port: 3030
	},
	media: {
		url: 'https://api.twitelo.me/public/media',
		path: {
			root: '/public/media/prod'
		}
	},
	logs: {
		discord: true
	},
	db: {
		name: 'twitelo'
	}
};

// Exports module
module.exports = config;