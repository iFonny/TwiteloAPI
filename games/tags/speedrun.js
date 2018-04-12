//=======================================================================//
//     FORMAT SETTINGS                                                   //
//=======================================================================//

const fieldSettings = {
    account: {
        type: 'account', // select
        tooltip: false,
        input: false, // already handled by the component
        label: { // required
            en: 'Account',
            fr: 'Compte'
        }
    }
};

//=======================================================================//
//     DATA SETTINGS                                                     //
//=======================================================================//

const dataSettings = {
    game: {
        type: 'string', // text input // TODO: changer pour un type special 
        tooltip: false,
        input: false, // because string type
        label: {
            en: 'Game',
            fr: 'Jeu'
        },
    },
    category: {
        type: 'string', // text input // TODO: changer pour un type special 
        tooltip: false,
        input: false, // because string type
        label: {
            en: 'Category',
            fr: 'Categorie'
        },
    }
};


//=======================================================================//
//     TAGS                                                              //
//=======================================================================//

module.exports = {};