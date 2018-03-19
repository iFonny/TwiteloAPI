//=======================================================================//
//     GET                                                               //
//=======================================================================//

module.exports.getAll = (userID) => {
    return r.table('setting').getAll(userID, {
        index: 'user_id'
    }).run();
};

module.exports.getAllWithPathByIDs = (userID, IDs) => {
    return r.table('setting')
        .getAll(userID, {
            index: 'user_id'
        })
        .filter((doc) => r.expr(IDs).contains(doc('id')))
        .filter(r.row('path').ne(null)).run();
};



//=======================================================================//
//     INSERT                                                            //
//=======================================================================//

module.exports.insert = (document) => {
    return r.table('setting').insert(document, {
        returnChanges: true
    }).run();
};

//=======================================================================//
//     EDIT                                                              //
//=======================================================================//

module.exports.update = (userID, document) => {
    return r.table('setting')
        .getAll(document.id, {
            index: 'id'
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

module.exports.deleteByIDs = (userID, IDs) => {
    return r.table('setting')
        .getAll(userID, {
            index: 'user_id'
        })
        .filter((doc) => r.expr(IDs).contains(doc('id')))
        .delete().run();
};

//=======================================================================//
//     OTHER                                                             //
//=======================================================================//

module.exports.count = (userID, filter) => {
    return r.table('setting')
        .getAll(userID, {
            index: 'user_id'
        })
        .filter(filter).count().run();
};