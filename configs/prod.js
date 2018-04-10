const config = {
	env: 'prod',
	server: {
		name: 'api',
		url: 'localhost:3030',
		host: 'api-beta.twitelo.me',
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
		discord: true,
		logDiscordWebhook: 'https://discordapp.com/api/webhooks/433094720173113344/qEQ5cN9iDxIFuqzXTHqGzcNWLeuJ0ySASiB6k2jIDYiSCnE7jZlg0tPNFjDJQpqH2BGe',
		infoDiscordWebhook: 'https://discordapp.com/api/webhooks/433094797717405698/pmeOt5YPVH4TjwrBtfDwn4_XEEImg4I-vlriEGRNmsf6evSLowNc8_CuB0KeiKmaTLm4',
		errorDiscordWebhook: 'https://discordapp.com/api/webhooks/433094869951578113/6iDs_Siclpot7kbuyhMknsfN8mHhwcBbwkLB66D-UvMufzREBh-g9NPUYRQQD8RyLzHV',
		fullErrorDiscordWebhook: 'https://discordapp.com/api/webhooks/433095068958588928/LtrweBMbOWCj_IorbBCz1twmTD2HWJCuLssu2DhAJ2Xkz5v_UW9Lx4COYFmdMp-xFTjy',
		recapDiscordWebhook: 'https://discordapp.com/api/webhooks/433094945914486784/sJiNU7Ny4v0_Qrzo5tG56EgX7qLtdsDS6TUQEj5-6Wt3caD8k-g76WgjdETL78szleGw',
		newUserDiscordWebhook: 'https://discordapp.com/api/webhooks/433094604578095124/3tgaxyiD_g9ebv9Sg_6akmrfdwhHE1XXF891tKjDswyq6Ahz1sXtlG6YnmhFjcHmBmAf',
		userActionsDiscordWebhook: 'https://discordapp.com/api/webhooks/433095139397861376/GpcYrli56oN-v32YaoG7rf0CxvDayaFExoqk2cL-dKmkrKqM4M6Ev7GBRsWkwi3K5dJy'
	},
	db: {
		name: 'twitelo'
	}
};

// Exports module
module.exports = config;