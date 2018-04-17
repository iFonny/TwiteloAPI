const SpeedrunAPI = require('speedrunapi');
const sr = new SpeedrunAPI();

module.exports = {
    getUserByUsername(username) {
        return new Promise((resolve, reject) => {

            if (username && username.length <= 20) {
                sr.users(username)
                    .exec()
                    .then(response => {
                        const user = response.items;
                        resolve({
                            user_id: user.id
                        });
                    })
                    .catch(error => {
                        if (error.statusCode == 404) resolve(null); // Doesn't exist
                        else reject(error); // Unknown error... 
                    });
            } else resolve(null); // Invalid or too long

        });
    },

    async getUserByID(id) {

        // Default values
        let data = {
            id: null,
            username: null
        };

        const account = await sr.users(id).exec()
            .then(res => res.items)
            .catch((error) => (data = null, __logError('[Speedrun] getUserByID() error', error)));

        if (data) {
            data.id = account.id;
            data.username = account.names.international;
        }

        return {
            requests: 1,
            data
        };
    },

    async getUserPersonalBests(user_id) {

        // Default values
        let data = {
            username: null,
            runs: []
        };


        const runs = await sr.users(user_id).personalBests()
            .param({
                max: 200
            })
            .param({
                embed: ['players']
            })
            .exec().then(runs => runs.items)
            .catch((error) => (data = null, __logError('[Speedrun] getUserPersonalBests() error', error)));

        if (data) { // If no errors
            for (const srRun of runs) {
                data.username = srRun.players.data[0].names.international;
                data.runs.push({
                    place: srRun.place,
                    time: srRun.run.times.primary_t,
                    settings: {
                        game: srRun.run.game,
                        category: srRun.run.category
                    }
                });
            }
        }

        return {
            requests: 1,
            data
        };
    },
};