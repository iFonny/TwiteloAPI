const config = {
	env: 'dev',
	server: {
		name: 'api-dev',
		url: 'localhost:3032',
		host: 'localhost',
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
		discord: true,
		logDiscordWebhook: 'https://discordapp.com/api/webhooks/419711270866911232/tTeAanQb6K6MdPpkgKT5TaWYCbtNpVmx6R0b1MI6hPTR9c5WXepBgvPHci8FYXJqfSYB',
		infoDiscordWebhook: 'https://discordapp.com/api/webhooks/419692188256174080/f_hujnP3JfF5igQuFJkobzwEsoSijqrjb2dOX47JGA6z_mGB5YT_FvU41IGjnDWR2abw',
		errorDiscordWebhook: 'https://discordapp.com/api/webhooks/419692059377664011/vv775VPUqJ9a137yWvFk-0rk438geaUfd8eQqjXImTpqq5Ms7PQOMCb-Nxx5Fh66jX8L',
		fullErrorDiscordWebhook: 'https://discordapp.com/api/webhooks/420835680105529345/jnnSOkfItZQ0BbQ4kaWmhHV8y16nc7p5jPezDqJ_5623q6WSd8cEXIFsIfvp7BTwpLxS',
		recapGameDiscordWebhook: 'https://discordapp.com/api/webhooks/419691884022333441/pnt3P5VpWnPfBe6h7TsqAkZF13h-WQGbec4vSXl_V1ABcZhT5FVjwwfiaNjHsq7jITay',
		recapTwitterDiscordWebhook: 'https://discordapp.com/api/webhooks/433548050720358400/SpZv07MW4FD0Hhz-0zQSThZcUQBLJYyx5sWVhnE4O-YYBvtKeH0Ias4DJFNGHiK0m1YN',
		newUserDiscordWebhook: 'https://discordapp.com/api/webhooks/433085685348433920/6MbkGKn2s3CvZTp1cjkuHQKS1uwhUQqrZk6iqcAFgnNb4IJPHsRZ6cLCy8h9BDCmF06h',
		userActionsDiscordWebhook: 'https://discordapp.com/api/webhooks/419700001367654413/b9-DeYHl_Tpmw9oYAGAtQESYLLEFSXQfmqSXEb8uKsYM9_r2LfN47HNvtw74XyDYMa42',
		contactWebhook: 'https://discordapp.com/api/webhooks/437442102994010113/DdBMvvLYjvaZb3j4rtWCpZZiR8MaorYwx1jkNZXVL6mnZnpafvyCipnwQz9iz4_yt7MM'
	},
	db: {
		name: 'twitelo_dev'
	}
};

// Exports module
module.exports = config;