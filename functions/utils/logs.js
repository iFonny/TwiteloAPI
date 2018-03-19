const request = require('request');

//=======================================================================//
//     	LOGS functions                                                   //
//=======================================================================//

module.exports.initLogs = () => {

	const sendDiscordLog = (type, message) => {
		let discordWebHook = null;
		let msg = '';

		if (config.logs.discord === false) return;

		switch (type) {
			case 'log':
				discordWebHook = config.logs.logDiscordWebhook;
				msg += ':loudspeaker: ';
				break;
			case 'info':
				discordWebHook = config.logs.infoDiscordWebhook;
				msg += ':mega: ';
				break;
			case 'error':
				discordWebHook = config.logs.errorDiscordWebhook;
				msg += ':x: ';
				break;
			case 'full-error':
				discordWebHook = config.logs.fullErrorDiscordWebhook;
				msg += ':x: ';
				break;
			case 'warn':
				discordWebHook = config.logs.errorDiscordWebhook;
				msg += ':warning: ';
				break;

			default:
				break;
		}

		if (discordWebHook === null) return;

		request.post({
			url: discordWebHook,
			json: {
				username: `Twitelo API - Logs [${config.env}]`,
				avatar_url: `${config.server.websiteURL}/public/images/logo.png`,
				content: msg + '`' + message + '`'
			}
		});
	};

	global.__log = (str) => {
		sendDiscordLog('log', str);
		console.log(str);
		return str;
	};

	global.__logInfo = (str) => {
		sendDiscordLog('info', str);
		console.info(str);
		return str;
	};

	global.__logError = (message, str) => {
		sendDiscordLog('error', message);
		sendDiscordLog('full-error', str);
		console.error(str);
		return str;
	};

	global.__logWarning = (str) => {
		sendDiscordLog('warn', str);
		console.warn(str);
		return str;
	};

};