const config = {
	env: 'prod',
	server: {
		name: 'api',
		url: 'localhost',
		websiteURL: 'https://api.twitelo.me',
		port: 3031
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