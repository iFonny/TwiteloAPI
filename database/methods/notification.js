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

module.exports.sendNotification = (destination, icon, type, content) => {
    let color;

    switch (type) {
        case 'success':
            color = 'is-lightgreen';
            break;
        case 'info':
            color = 'is-lightblue';
            break;
        case 'error':
            color = 'is-lightred';
            break;
        case 'warn':
            color = 'is-warning';
            break;
        default:
            color = 'is-lightblue';
            break;
    }

    return r.table('notification')
        .insert({
            icon,
            color,
            type,
            destination,
            en: content.en,
            fr: content.fr,
            created: Date.now(),
            archived: false
        }).run();
};


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