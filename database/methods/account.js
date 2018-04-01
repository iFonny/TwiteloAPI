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