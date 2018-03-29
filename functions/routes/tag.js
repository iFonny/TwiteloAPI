//=======================================================================//
//     TAG functions                                                     //
//=======================================================================//

module.exports = {


    /* Check parameters */

    checkParamsTagCreate(params) {
        return new Promise((resolve, reject) => {

            let tag = {
                tag_id: '',
                game_id: '',
                settings: {}
            };

            // Check mandatory params
            if (params.tag_id && typeof params.tag_id == 'string') tag.tag_id = params.tag_id;
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing tag_id')));

            if (params.game_id && typeof params.game_id == 'string') tag.game_id = params.game_id;
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing game_id')));

            if (params.settings && Server.tags[tag.game_id] && Server.tags[tag.game_id][tag.tag_id]) {
                for (const key in Server.tags[tag.game_id][tag.tag_id].fieldSettings) {
                    if (params.settings[key] != null && ['boolean', 'string', 'number'].includes(typeof params.settings[key])) {
                        tag.settings[key] = params.settings[key];
                    } else return reject((Server.fn.api.jsonError(400, `Bad or Missing '${key}' setting`)));
                }
            } else return reject((Server.fn.api.jsonError(400, 'Bad or Missing settings')));

            resolve(tag);

        });
    },

    /* Functions */

    getAll(userID) {
        return new Promise((resolve, reject) => {
            Server.fn.dbMethods.tag.getAll(userID)
                .then(tags => resolve(tags))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] createTag() error', err)));

        });
    },

    createTag(userID, tag) {
        return new Promise((resolve, reject) => {

            tag.user_id = userID;
            tag.created = Date.now();

            Server.fn.dbMethods.tag.insert(tag)
                .then(result => resolve(result.changes[0].new_val))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Internal server error', '[DB] createTag() error', err)));

        });
    },

    addInfo(tag, isArray = false) {
        if (isArray) {
            for (const key in tag) {
                tag[key].info = Server.tags[tag[key].game_id][tag[key].tag_id];
            }
            return Promise.resolve(Server.fn.api.jsonSuccess(200, tag));
        } else return Promise.resolve(Server.fn.api.jsonSuccess(200, (tag.info = Server.tags[tag.game_id][tag.tag_id], tag)));
    },
};