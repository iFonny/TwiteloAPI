//=======================================================================//
//     GET                                                               //
//=======================================================================//

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
    return r.db('twitelo_dev').table('tag')
        .filter({
            included: false,
            game_id: 'lol'
        })
        .filter(r.row('updated').lt(Date.now() - (time * 1000)))
        .map({
            game_id: r.row('game_id'),
            tag_id: r.row('tag_id'),
            data_settings: r.row('data_settings'),
            game_account_info: r.row('game_account_info')
        })
        .distinct().run();
};