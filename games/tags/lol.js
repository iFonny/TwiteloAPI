//=======================================================================//
//     FORMAT SETTINGS                                                   //
//=======================================================================//

// Settings applied to the retrieved data (ex: format, size...)
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
                value: 0, // Size add or sub
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
            original: {
                value: 0,
                en: 'No change',
                fr: 'Aucune modification'
            },
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
//     DATA SETTINGS                                                     //
//=======================================================================//

// Settings applied at the time of data retrieve (Like: game, category...)
const dataSettings = {
    game: {
        type: 'string', // text input
        tooltip: false,
        input: false, // because string type
        label: {
            en: 'Game',
            fr: 'Jeu'
        },
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
        size: 10, // default size
        account: true, // need account or not
        useExample: false, // Use a static data or update game data on tag creation/update (set to 'true' if strict ratelimits)
        fieldSettings: { // Settings applied to the retrieved data (ex: format, size...)
            size: fieldSettings.size, // existing setting
            format: fieldSettings.format // existing setting
        },
        dataSettings: { // Settings applied at the time of data retrieve (Like: game, category...)
            game: dataSettings.game, // existing setting
        },
        settingsOrder: ['size', 'format'], // settings order
        generator: 'tier', // function called to generate data 
        data: {
            size: { // setting property
                default: { // setting value
                    'UNRANKED': 'UNRANKED',
                    'BRONZE': 'BRONZE',
                    'SILVER': 'SILVER',
                    'GOLD': 'GOLD',
                    'PLATINUM': 'PLATINUM',
                    'DIAMOND': 'DIAMOND',
                    'MASTER': 'MASTER',
                    'CHALLENGER': 'CHALLENGER',
                },
                short: { // setting value
                    'UNRANKED': 'UNRANK',
                    'BRONZE': 'BRONZE',
                    'SILVER': 'SILVER',
                    'GOLD': 'GOLD',
                    'PLATINUM': 'PLAT',
                    'DIAMOND': 'DIAM',
                    'MASTER': 'MASTER',
                    'CHALLENGER': 'CHALL',
                }
            },
            format: { // setting property
                original: _.trim,
                lowercase: _.toLower, // setting value
                uppercase: _.toUpper, // setting value
                capitalize: _.capitalize // setting value
            }
        },
        exampleOriginal: 'PLAT',
        example: {
            size: { // setting property
                default: { // setting value
                    format: { // setting property
                        original: 'DIAMOND',
                        uppercase: 'DIAMOND', // setting value
                        lowercase: 'diamond', // setting value
                        capitalize: 'Diamond' // setting value
                    }
                },
                short: { // setting value
                    format: { // setting property
                        original: 'DIAM',
                        uppercase: 'DIAM', // setting value
                        lowercase: 'diam', // setting value
                        capitalize: 'Diam' // setting value
                    }
                }
            }
        }
    }
};