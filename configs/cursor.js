const devConfig = require('./dev');
const prodConfig = require('./prod');
const testConfig = require('./test');

// packages
const path = require('path');

// Datas
const env = process.env.NODE_ENV || devConfig.env;
let config = {};

// Switch between env
switch (env) {

    case 'dev': // Development
        config = devConfig;
        break;

    case 'prod': // Production
        config = prodConfig;
        break;

    case 'test': // Test
        config = testConfig;
        break;
}

// Generic config

config.root = path.normalize(`${__dirname}/..`);
config.logs.logDiscordWebhook = 'https://discordapp.com/api/webhooks/419711270866911232/tTeAanQb6K6MdPpkgKT5TaWYCbtNpVmx6R0b1MI6hPTR9c5WXepBgvPHci8FYXJqfSYB';
config.logs.infoDiscordWebhook = 'https://discordapp.com/api/webhooks/419692188256174080/f_hujnP3JfF5igQuFJkobzwEsoSijqrjb2dOX47JGA6z_mGB5YT_FvU41IGjnDWR2abw';
config.logs.errorDiscordWebhook = 'https://discordapp.com/api/webhooks/419692059377664011/vv775VPUqJ9a137yWvFk-0rk438geaUfd8eQqjXImTpqq5Ms7PQOMCb-Nxx5Fh66jX8L';
config.logs.fullErrorDiscordWebhook = 'https://discordapp.com/api/webhooks/420835680105529345/jnnSOkfItZQ0BbQ4kaWmhHV8y16nc7p5jPezDqJ_5623q6WSd8cEXIFsIfvp7BTwpLxS';
config.logs.websocketsDiscordWebhook = 'https://discordapp.com/api/webhooks/419691884022333441/pnt3P5VpWnPfBe6h7TsqAkZF13h-WQGbec4vSXl_V1ABcZhT5FVjwwfiaNjHsq7jITay';
config.logs.newUserDiscordWebhook = 'https://discordapp.com/api/webhooks/419691088329048071/qiZ0T7taRT4ULy1FBZbfUiYCgBUVxwmcvb0JfOLb-JHMnTMsdJWvNAafN6hFg9eEFLog';
config.logs.userActionsDiscordWebhook = 'https://discordapp.com/api/webhooks/419700001367654413/b9-DeYHl_Tpmw9oYAGAtQESYLLEFSXQfmqSXEb8uKsYM9_r2LfN47HNvtw74XyDYMa42';




// Media
config.media.maxSize = '700'; // Kb / Limit twitter (d'apres la doc twitter - a verifier)
// Media paths
config.media.path.pp = `${config.media.path.root}/pp`; // Path des images de profil

// constant data (ex: list roles)
config.constant = require(`${config.root}/configs/constant`);
// secret configs
config.secret = require(`${config.root}/configs/secret`);

// Exports module
module.exports = config;