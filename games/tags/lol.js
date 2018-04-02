//=======================================================================//
//     FIELD SETTINGS                                                    //
//=======================================================================//

const fieldSettings = {
    size: {
        type: 'select', // select
        tooltip: {
            en: 'Text size in the profile',
            fr: 'Taille du texte dans le profil'
        },
        label: {
            en: 'Size',
            fr: 'Taille'
        },
        input: {
            default: {
                value: 0,
                en: 'Default size',
                fr: 'Taille par défaut'
            },
            short: {
                value: -4,
                en: 'Short',
                fr: 'Court'
            }
        },
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
                value: 0,
                en: 'EXAMPLE',
                fr: 'EXEMPLE'
            },
            lowercase: {
                value: 0,
                en: 'example',
                fr: 'exemple'
            },
            capitalize: {
                value: 0,
                en: 'Example',
                fr: 'Exemple'
            }
        }
    }
};

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
        size: 10,
        account: true, // need account or not
        //settingsOrder: ['size', 'format'],
        fieldSettings: {
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