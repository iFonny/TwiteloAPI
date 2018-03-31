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

    checkParamsTagUpdateSettings(bodyParams, urlParams) {
        return new Promise((resolve, reject) => {

            let tag = {
                id: '',
                tag_id: '',
                game_id: '',
                settings: {}
            };

            // Check mandatory params
            if (urlParams.id && typeof urlParams.id == 'string' && urlParams.id.length > 0) tag.id = urlParams.id;
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing id')));

            // Check mandatory params
            if (bodyParams.tag_id && typeof bodyParams.tag_id == 'string') tag.tag_id = bodyParams.tag_id;
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing tag_id')));

            if (bodyParams.game_id && typeof bodyParams.game_id == 'string') tag.game_id = bodyParams.game_id;
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing game_id')));

            if (bodyParams.settings && Server.tags[tag.game_id] && Server.tags[tag.game_id][tag.tag_id]) {
                for (const key in Server.tags[tag.game_id][tag.tag_id].fieldSettings) {
                    if (bodyParams.settings[key] != null && ['boolean', 'string', 'number'].includes(typeof bodyParams.settings[key])) {
                        tag.settings[key] = bodyParams.settings[key];
                    } else return reject((Server.fn.api.jsonError(400, `Bad or Missing '${key}' setting`)));
                }
            } else return reject((Server.fn.api.jsonError(400, 'Bad or Missing settings')));

            delete tag.tag_id;
            delete tag.game_id;

            resolve(tag);

        });
    },

    checkParamsTagID(params) {
        return new Promise((resolve, reject) => {

            // Check mandatory params
            if (params.id && typeof params.id == 'string' && params.id.length > 0) resolve(params.id);
            else return reject((Server.fn.api.jsonError(400, 'Bad or Missing id')));
        });
    },

    /* Functions */

    getAll(userID) {
        return new Promise((resolve, reject) => {
            Server.fn.dbMethods.tag.getAll(userID)
                .then(tags => resolve(tags))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t get tags', '[DB] getAll() error', err)));

        });
    },

    createTag(userID, tag) {
        return new Promise((resolve, reject) => {

            tag.user_id = userID;
            tag.created = Date.now();

            Server.fn.dbMethods.tag.insert(tag)
                .then(async (result) => {
                    let newTag = result.changes[0].new_val;

                    const game = await Server.fn.dbMethods.game.get(newTag.game_id);
                    delete newTag.game_id;
                    newTag.game = {
                        id: game.id,
                        name: game.name,
                        small_name: game.small_name,
                        color: game.color
                    };
                    resolve(newTag);
                })
                .catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t create tag', '[DB] createTag() error', err)));

        });
    },

    updateTagSettings(userID, tag) {
        return new Promise((resolve, reject) => {

            Server.fn.dbMethods.tag.update(userID, tag)
                .then(async (result) => {
                    if (result.replaced) resolve(Server.fn.api.jsonSuccess(200, result.changes[0].new_val.settings));
                    else resolve(Server.fn.api.jsonSuccess(200, false));
                })
                .catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t update tag', '[DB] updateTagSettings() error', err)));

        });
    },

    deleteTagFromProfile(user, id) {
        return new Promise((resolve, reject) => {

            const twitelo = {
                description: {
                    content: user.twitelo.description.content.replace(`<{${id}}>`, '').trim()
                },
                name: {
                    content: user.twitelo.name.content.replace(`<{${id}}>`, '').trim()
                },
                location: {
                    content: user.twitelo.location.content.replace(`<{${id}}>`, '').trim()
                },
                url: {
                    content: user.twitelo.url.content.replace(`<{${id}}>`, '').trim()
                }
            };

            Server.fn.dbMethods.user.update(user.id, {
                    twitelo
                })
                .then(() => resolve(id))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t delete tag from profile', '[DB] deleteTagFromProfile() error', err)));

        });
    },

    deleteTag(userID, id) {
        return new Promise((resolve, reject) => {

            Server.fn.dbMethods.tag.delete(userID, id)
                .then((result) => resolve(Server.fn.api.jsonSuccess(200, result.deleted ? true : false)))
                .catch(err => reject(Server.fn.api.jsonError(500, 'Can\'t delete tag', '[DB] deleteTag() error', err)));

        });
    },

    addInfo(tag, isArray = false) {
        if (isArray) {
            let tagsInfo = [];

            for (const key in tag) {
                if (Server.tags[tag[key].game.id][tag[key].tag_id]) {
                    tag[key].info = Server.tags[tag[key].game.id][tag[key].tag_id];
                    tagsInfo.push(tag[key]);
                }
            }
            return Promise.resolve(Server.fn.api.jsonSuccess(200, tagsInfo));
        } else return Promise.resolve(Server.fn.api.jsonSuccess(200, (tag.info = Server.tags[tag.game.id][tag.tag_id], tag)));
    },
};