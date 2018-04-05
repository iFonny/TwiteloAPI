//=======================================================================//
//     GET                                                               //
//=======================================================================//

module.exports.getByTagIDAndFilter = (tagID, condition) => {
    return r.table('game_data').getAll(tagID, {
        index: 'tag_id'
    }).filter(condition).run();
};

//=======================================================================//
//     INSERT                                                            //
//=======================================================================//

module.exports.insert = (document) => {
    return r.table('game_data').insert(document).run();
};

//=======================================================================//
//     EDIT                                                              //
//=======================================================================//

module.exports.updateByTagIDAndFilter = (tagID, condition, document) => {
    return r.table('game_data').getAll(tagID, {
            index: 'tag_id'
        })
        .filter(condition)
        .update(document).run();
};

//=======================================================================//
//     DELETE                                                            //
//=======================================================================//

module.exports.deleteByTagIDAndFilter = (tagID, condition) => {
    return r.table('game_data').getAll(tagID, {
        index: 'tag_id'
    }).filter(condition).delete().run();
};

//=======================================================================//
//     OTHER                                                             //
//=======================================================================//