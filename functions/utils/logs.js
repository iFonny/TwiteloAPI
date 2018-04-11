const request = require('request');
const util = require('util');

//=======================================================================//
//     	LOGS functions                                                   //
//=======================================================================//

module.exports.initLogs = () => {

	const sendDiscordLog = (type, message) => {
		let discordWebHook = null;
		let color = '';

		if (config.logs.discord === false) return;

		switch (type) {
			case 'log':
				discordWebHook = config.logs.logDiscordWebhook;
				color = 5687273;
				break;
			case 'recap-game':
				discordWebHook = config.logs.recapGameDiscordWebhook;
				color = 5687273;
				break;
			case 'recap-twitter':
				discordWebHook = config.logs.recapTwitterDiscordWebhook;
				color = 5687273;
				break;
			case 'info':
				discordWebHook = config.logs.infoDiscordWebhook;
				color = 5687273;
				break;
			case 'user-action':
				discordWebHook = config.logs.userActionsDiscordWebhook;
				color = 5687273;
				break;
			case 'error':
				discordWebHook = config.logs.errorDiscordWebhook;
				color = 15868707;
				break;
			case 'full-error':
				discordWebHook = config.logs.fullErrorDiscordWebhook;
				color = 15868707;
				break;
			case 'warn':
				discordWebHook = config.logs.errorDiscordWebhook;
				color = 16773214;
				break;

			default:
				break;
		}

		if (typeof message != 'string') {
			console.log(typeof message);
			message = util.inspect(message, {
				showHidden: true,
				depth: null
			}); // TODO: A TESTER, JSON.stringify(message);
		}

		if (discordWebHook === null) return;

		request.post({
			url: discordWebHook,
			json: {
				username: `Twitelo API - Logs [${config.env}]`,
				avatar_url: 'https://ifonny.en-f.eu/3047f9b25045.png', // TODO: Remplacer en prod par : `${config.server.websiteURL}/public/images/logo.png`,
				embeds: [{
					color,
					description: message.substr(0, 1998),
					timestamp: Server.moment().format(),
					footer: {
						icon_url: 'https://ifonny.en-f.eu/4c12c62c15f3.jpg', // TODO: Remplacer en prod
						text: type
					}
				}]
			}
		});
	};

	global.__logJoinLeave = ({
		username,
		pp,
		count,
		join
	}) => {
		request.post({
			url: config.logs.newUserDiscordWebhook,
			json: {
				username: `Twitelo ${config.env == 'dev' ? '[dev]' : ''}`,
				avatar_url: 'https://ifonny.en-f.eu/3047f9b25045.png', // TODO: Remplacer en prod par : `${config.server.websiteURL}/public/images/logo.png`,
				embeds: [{
					color: join ? 2090547 : 15868707,
					timestamp: Server.moment().format(),
					fields: [{
						name: 'Total users',
						value: count.all,
						inline: true
					}, {
						name: 'Total active users',
						value: count.active,
						inline: true
					}],
					author: {
						name: `${username}`,
						url: `https://twitter.com/${username}`,
						icon_url: pp
					},
					footer: {
						icon_url: 'https://ifonny.en-f.eu/4c12c62c15f3.jpg', // TODO: Remplacer en prod
						text: join ? 'Join' : 'Leave'
					}
				}]
			}
		});
		console.info(`${join ? 'New user' : 'Delete user'} : @${username} | total users : ${count.all} | total active users : ${count.active}`);
		return {
			username,
			pp,
			count,
			join
		};
	};

	global.__log = (str) => {
		sendDiscordLog('log', str);
		console.log(str);
		return str;
	};

	global.__logRecapGame = (str) => {
		sendDiscordLog('recap-game', str);
		console.log(str);
		return str;
	};

	global.__logRecapTwitter = (str) => {
		sendDiscordLog('recap-twitter', str);
		console.log(str);
		return str;
	};

	global.__logInfo = (str) => {
		sendDiscordLog('info', str);
		console.info(str);
		return str;
	};

	global.__logUserAction = (str, data) => {
		sendDiscordLog('user-action', str);
		return Promise.resolve(data);
	};

	global.__logError = (message, full) => {
		sendDiscordLog('error', message);
		sendDiscordLog('full-error', full);
		console.error(full);
		return full;
	};

	global.__logWarning = (message, full) => {
		sendDiscordLog('warn', message);
		console.warn(full);
		return full;
	};

};