module.exports = {

    getDataSize(tag, settings) {
        let size = tag.size;
        for (const settingKey in settings) {
            if (tag.fieldSettings[settingKey].input[settings[settingKey]])
                size += tag.fieldSettings[settingKey].input[settings[settingKey]].value;
            else return null;
        }
        return size;
    },

    useMeBeforeEachRequest(ratelimit, counters) {
        if (counters.reqCounter >= ratelimit.request) {
            counters.reqCounter = 0;
            return new Promise(resolve => setTimeout(() => resolve(counters.reqCounter), ratelimit.every * 1000));
        } else return Promise.resolve(counters.reqCounter);
    },
    useMeAfterEachRequest(counters, requests) {
        counters.reqCounter += requests;
        counters.totalRequests += requests;
    },

    getGameDataDoc(data, tag_id, game_id, data_settings, game_account_info) {
        if (data === null || data === undefined || data === '') return null;
        else if (typeof data == 'object') return (__logError(`[${tag_id}] data can't be an object`, data), null);
        else return {
            tag_id,
            game_id,
            data_settings,
            game_account_info,
            updated: Date.now(),
            data: data.toString(),
        };
    },

    async updateGameData(data, tag_id, game_id, data_settings, game_account_info, counters) {
        counters.totalTags += 1;
        const document = this.getGameDataDoc(data, tag_id, game_id, data_settings, game_account_info);

        // Update original tags

        await Server.fn.dbMethods.tag.updateByTagIDAndFilter(tag_id, {
            game_id,
            data_settings,
            game_account_info
        }, {
            updated: Date.now()
        }).catch(err => __logError(`Can't update game_data : ${tag_id}`, err));

        if (document == null) {

            // Delete null data
            await Server.fn.dbMethods.game_data.deleteByTagIDAndFilter(tag_id, {
                    game_id,
                    data_settings,
                    game_account_info
                })
                .catch(err => __logError(`Can't delete null tag data : ${tag_id}`, err));
        } else {

            // Check if data already exist
            await Server.fn.dbMethods.game_data.getByTagIDAndFilter(tag_id, {
                    game_id,
                    data_settings,
                    game_account_info
                })
                .then(async (game_data) => {
                    if (game_data && game_data.length > 0) {

                        // Triggers can be used here

                        // Update existing data_game
                        await Server.fn.dbMethods.game_data.updateByTagIDAndFilter(tag_id, {
                            game_id,
                            data_settings,
                            game_account_info
                        }, document).catch(err => __logError(`Can't update game_data : ${tag_id}`, err));
                    } else {

                        // Insert new data_game
                        await Server.fn.dbMethods.game_data.insert(document).catch(err => __logError(`Can't insert game_data : ${tag_id}`, err));
                    }
                }).catch(err => __logError(`Can't get game_data : ${tag_id}`, err));
        }
    },


};