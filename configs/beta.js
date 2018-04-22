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
		discord: true,
		logDiscordWebhook: 'https://discordapp.com/api/webhooks/433092792634310667/ZcKCJ-dh64tQR8mGEQ8yuI2izx3v2hWWoGdM2_ZPdbDkywozgu5BjgMljmBHIwm_8igS',
		infoDiscordWebhook: 'https://discordapp.com/api/webhooks/433092906321182720/6A58RRhDgHokbjsc5IGNliojbOix4x-5T_Lt0fd10mLbzVsBDn16hCTaI9FoWtjEM_bC',
		errorDiscordWebhook: 'https://discordapp.com/api/webhooks/433092974684143627/hfCjjcGRufoK8mP94oGam0PT33zuI8p1nzEBaR6A7NoAljWrl6NQKRZ374SNF46r3yON',
		fullErrorDiscordWebhook: 'https://discordapp.com/api/webhooks/433093111669981194/3fuA_UydxN2SUR2QH54JpgRCVlnCtRmIUf-h7ZnCXJU910k099S1M7SX_AAsJIY0MTDU',
		recapGameDiscordWebhook: 'https://discordapp.com/api/webhooks/433093054975705099/gK1VQrS5-VkaEXKFuF8geDKDoLPVZRydsH06ADrNCiEo-vkVfDId4GkR18J814Ioe8i4',
		recapTwitterDiscordWebhook: 'https://discordapp.com/api/webhooks/433548475699822602/H4fr9a1bV8Pz21gLp258FT7AX7dkHdy4q_9yr5V2vmL7CX2MAfRclW_2TmZkvPLmELOH',
		newUserDiscordWebhook: 'https://discordapp.com/api/webhooks/433092725064073226/2pHCtoIdVIWlJhMXT2BhspN2Mv2t4DIQRGf7Ol8dWzqNZUvvYMOQI_IZ5cc8TAk9tMMd',
		userActionsDiscordWebhook: 'https://discordapp.com/api/webhooks/433093716270645248/LfK3Ix_x9-syibaFz6KUQLAtEz1SVMaYo1uHYuNqgUvN6DzVLl1xyU53E8G3YmZFGb0I',
		contactWebhook: 'https://discordapp.com/api/webhooks/437442699918966804/iNZqoGQ77L-nMjFHieQAiEls3ZZ5Je_LxGmmtXnoQ15HGGrLR1pulaW-gXwBWtEi2hvC'
	},
	db: {
		name: 'twitelo_beta'
	}
};

// Exports module
module.exports = config;