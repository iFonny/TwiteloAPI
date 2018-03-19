const config = {
	env: 'dev',
	server: {
		name: 'api-dev',
		url: 'localhost',
		websiteURL: 'https://api-dev.twitelo.me',
		port: 3030
	},
	media: {
		url: 'https://api-dev.twitelo.me/public/media',
		path: {
			root: '/public/media/dev'
		}
	},
	logs: {
		discord: false
	},
	db: {
		name: 'twitelo_dev'
	}
};

// Exports module
module.exports = config;