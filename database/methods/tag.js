//=======================================================================//
//     GET                                                               //
//=======================================================================//

module.exports.getAll = (userID) => {
    return r.table('tag')
        .getAll(userID, {
            index: 'user_id'
        })
        .eqJoin(
            'game_id',
            r.table('game'), {
                index: 'id'
            }
        ).map({
            id: r.row('left')('id'),
            created: r.row('left')('created'),
            settings: r.row('left')('settings'),
            tag_id: r.row('left')('tag_id'),
            user_id: r.row('left')('user_id'),
            game: {
                id: r.row('right')('id'),
                name: r.row('right')('name'),
                small_name: r.row('right')('small_name')
            }
        }).orderBy('created').run();
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

//=======================================================================//
//     DELETE                                                            //
//=======================================================================//


//=======================================================================//
//     OTHER                                                             //
//=======================================================================//