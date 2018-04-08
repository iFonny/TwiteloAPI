//=======================================================================//
//     GET                                                               //
//=======================================================================//

module.exports.get = (id) => {
    return r.table('tag').get(id).run();
};

module.exports.getAll = (userID) => {
    return r.table('tag')
        .getAll(userID, {
            index: 'user_id'
        }).orderBy('created').run();
};


module.exports.getWithFilter = (userID, condition) => {
    return r.table('tag')
        .getAll(userID, {
            index: 'user_id'
        })
        .filter(condition).run();
};

module.exports.getByUserAndIDs = (userID, tagIDs) => {
    return r.table('tag').getAll(r.args(tagIDs), {
            index: 'id'
        })
        .filter({
            user_id: userID
        }).run();
};



//=======================================================================//
//     INSERT                                                            //
//=======================================================================//

module.exports.insert = (document) => {
    return r.table('tag').insert(document, {
        returnChanges: true
    }).run();
};

//=======================================================================//
//     EDIT                                                              //
//=======================================================================//

module.exports.update = (userID, document) => {
    return r.table('tag')
        .getAll(document.id, {
            index: 'id'
        })
        .filter({
            user_id: userID
        }).update(document, {
            returnChanges: true
        }).run();
};

module.exports.updateByAccountID = (userID, accountID, document) => {
    return r.table('tag')
        .getAll(accountID, {
            index: 'account_id'
        })
        .filter({
            user_id: userID
        }).update(document, {
            returnChanges: true
        }).run();
};

module.exports.updateByTagIDAndFilter = (tagID, condition, document) => {
    return r.table('tag').getAll(tagID, {
            index: 'tag_id'
        })
        .filter(condition)
        .update(document).run();
};

module.exports.updateByUserID = (userID, document) => {
    return r.table('tag').getAll(userID, {
        index: 'user_id'
    }).update(document).run();
};

module.exports.updateByUserAndIDs = (userID, tagIDs, document) => {
    return r.table('tag').getAll(r.args(tagIDs), {
            index: 'id'
        })
        .filter({
            user_id: userID
        }).update(document).run();
};




//=======================================================================//
//     DELETE                                                            //
//=======================================================================//

module.exports.delete = (userID, id) => {
    return r.table('tag')
        .getAll(id, {
            index: 'id'
        })
        .filter({
            user_id: userID
        })
        .delete().run();
};

module.exports.deleteByIDs = (userID, ids) => {
    return r.table('tag')
        .getAll(userID, {
            index: 'user_id'
        })
        .filter(
            function (doc) {
                return r.expr(ids)
                    .contains(doc('id'));
            }
        )
        .delete().run();
};

//=======================================================================//
//     OTHER                                                             //
//=======================================================================//

module.exports.getTagsToUpdate = (game, time) => {
    return r.table('tag')
        .filter({
            included: false, // TODO: changer to true
            game_id: game
        })
        .filter(r.row('updated').lt(Date.now() - (time * 1000)))
        .map({
            game_id: r.row('game_id'),
            tag_id: r.row('tag_id'),
            data_settings: r.row('data_settings'),
            game_account_info: r.row('game_account_info')
        })
        .distinct()
        .group('game_id', 'data_settings', 'game_account_info')
        .run();
};