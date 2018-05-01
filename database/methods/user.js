//=======================================================================//
//     GET                                                               //
//=======================================================================//

module.exports.get = (id) => {
    return r.table('user').get(id).run();
};

module.exports.getLatestActive = (limit = 10) => {
    return r.table('user').orderBy({
            index: r.desc('created')
        })
        .filter(
            r.row('disabled').lt(config.constant.disabledAfter)
            .and(r.row('switch').eq(true))
            .and(r.row('twitelo')('description')('status').eq(true))
            .and(r.row('twitelo')('description')('content').match('<{[^<>{} ]+?}>'))
        )
        .limit(limit)
        .pluck('id', 'name', 'username', 'twitter_id', 'profile_image_url')
        .run();
};

module.exports.getUsersToUpdate = () => {
    return r.table('user')
        .filter(
            r.row('disabled').lt(config.constant.disabledAfter)
            .and(r.row('switch').eq(true))
        ).run();
};


//=======================================================================//
//     INSERT                                                            //
//=======================================================================//


//=======================================================================//
//     EDIT                                                              //
//=======================================================================//

module.exports.update = (id, document) => {
    return r.table('user').get(id).update(document, {
        returnChanges: 'always'
    }).run();
};

//=======================================================================//
//     DELETE                                                            //
//=======================================================================//

module.exports.delete = (id) => {
    return r.table('user').get(id).delete().run();
};


//=======================================================================//
//     OTHER                                                             //
//=======================================================================//

module.exports.count = (filter) => {
    return r.table('user').filter(filter).count().run();
};