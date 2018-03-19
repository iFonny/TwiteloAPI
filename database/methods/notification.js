//=======================================================================//
//     GET                                                               //
//=======================================================================//

module.exports.getAllByUser = (userID) => {
    return r.table('notification')
        .getAll(userID, 'global', {
            index: 'destination'
        })
        .orderBy(r.desc('created')).run();
};

module.exports.getAllByUserLimit = (userID, limit) => {
    return r.table('notification')
        .getAll(userID, 'global', {
            index: 'destination'
        }).
    orderBy(r.desc('created'))
        .limit(limit).run();
};

module.exports.getUnarchivedByUser = (userID) => {
    return r.table('notification')
        .getAll(userID, 'global', {
            index: 'destination'
        })
        .filter({
            archived: false
        })
        .orderBy(r.desc('created')).run();
};

module.exports.getUnarchivedByUserLimit = (userID, limit) => {
    return r.table('notification')
        .getAll(userID, 'global', {
            index: 'destination'
        })
        .filter({
            archived: false
        })
        .orderBy(r.desc('created'))
        .limit(limit).run();
};


//=======================================================================//
//     INSERT                                                            //
//=======================================================================//


//=======================================================================//
//     EDIT                                                              //
//=======================================================================//

module.exports.update = (userID, IDs, toUpdate) => {
    return r.table('notification')
        .getAll(userID, {
            index: 'destination'
        })
        .filter((doc) => r.expr(IDs).contains(doc('id')))
        .update(toUpdate).run();
};

//=======================================================================//
//     DELETE                                                            //
//=======================================================================//


//=======================================================================//
//     OTHER                                                             //
//=======================================================================//