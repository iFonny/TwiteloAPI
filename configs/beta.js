const config = {
	env: 'beta',
	server: {
		name: 'api-beta',
		url: 'localhost:3031',
		host: 'api-beta.twitelo.me',
		appURL: 'https://beta.twitelo.me',
		websiteURL: 'https://api-beta.twitelo.me',
		port: 3031
	},
	media: {
		url: 'https://api-beta.twitelo.me/public/media',
		path: {
			root: '/public/media/dev'
		}
	},
	logs: {
		discord: true
	},
	db: {
		name: 'twitelo_beta'
	}
};

// Exports module
module.exports = config;