//=======================================================================//
//     GET                                                               //
//=======================================================================//

module.exports.get = (userID, id) => {
    return r.table('account')
        .getAll(id, {
            index: 'id'
        })
        .filter({
            user_id: userID
        }).run();
};

module.exports.getAll = (userID) => {
    return r.table('account')
        .getAll(userID, {
            index: 'user_id'
        }).orderBy('created').run();
};

//=======================================================================//
//     INSERT                                                            //
//=======================================================================//

module.exports.insert = (document) => {
    return r.table('account').insert(document, {
        returnChanges: true
    }).run();
};

//=======================================================================//
//     EDIT                                                              //
//=======================================================================//

module.exports.update = (userID, document) => {
    return r.table('account')
        .getAll(document.id, {
            index: 'id'
        })
        .filter({
            user_id: userID
        }).update(document, {
            returnChanges: true
        }).run();
};

module.exports.updateWithFilter = (condition, document) => {
    return r.table('account')
        .filter(condition)
        .update(document).run();
};

//=======================================================================//
//     DELETE                                                            //
//=======================================================================//

module.exports.delete = (userID, id) => {
    return r.table('account')
        .getAll(id, {
            index: 'id'
        })
        .filter({
            user_id: userID
        })
        .delete().run();
};

//=======================================================================//
//     OTHER                                                             //
//=======================================================================//

module.exports.count = (userID, filter) => {
    return r.table('account')
        .getAll(userID, {
            index: 'user_id'
        })
        .filter(filter).count().run();
};