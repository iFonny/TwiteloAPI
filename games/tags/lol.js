//=======================================================================//
//     FIELD SETTINGS                                                    //
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
    },
    size: {
        type: 'size', // select
        input: false, // already handled by the component
        tooltip: {
            en: 'Text length in profile',
            fr: 'Longueur du texte dans le profil'
        },
        label: {
            en: 'Size',
            fr: 'Taille'
        }
    },
    format: {
        type: 'select', // select
        tooltip: false,
        label: {
            en: 'Formatting',
            fr: 'Mise en forme'
        },
        input: {
            uppercase: {
                en: 'EXAMPLE',
                fr: 'EXEMPLE'
            },
            lowercase: {
                en: 'example',
                fr: 'exemple'
            },
            capitalize: {
                en: 'Example',
                fr: 'Exemple'
            }
        }
    }
};

//=======================================================================//
//     DATA SETTINGS                                                     //
//=======================================================================//

// TODO


//=======================================================================//
//     TAGS                                                              //
//=======================================================================//

module.exports = {
    LOL__RANKED_SOLO_SR__TIER: {
        id: 'LOL__RANKED_SOLO_SR__TIER', // gameTag ID : {GAME_ID}__{CATEGORY_SMALL}_{NAME_SMALL}
        gameID: 'lol', // game ID
        category: 'Ranked Solo Summoner\'s Rift', // Category name
        categorySmall: 'Ranked Solo SR', // Category small name
        name: 'Tier', // Tag name
        nameSmall: 'Tier', // Tag small name
        size: { // Tag sizes
            default: 10, // default is required !!
            short: 6
        },
        fieldSettings: {
            account: fieldSettings.account, // existing setting
            size: fieldSettings.size, // existing setting
            format: fieldSettings.format // existing setting
        },
        example: {
            size: { // setting property
                default: { // setting value
                    format: { // setting property
                        uppercase: 'DIAMOND', // setting value
                        lowercase: 'diamond', // setting value
                        capitalize: 'Diamond' // setting value
                    }
                },
                short: { // setting value
                    format: { // setting property
                        uppercase: 'DIAM', // setting value
                        lowercase: 'diam', // setting value
                        capitalize: 'Diam' // setting value
                    }
                }
            }
        }
    }
};