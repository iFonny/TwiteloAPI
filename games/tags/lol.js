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
    sizeRegion: {
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
            longFR: {
                value: 16,
                en: 'Full name in French',
                fr: 'Nom complet en français'
            },
            longEN: {
                value: 16,
                en: 'Full name in English',
                fr: 'Nom complet en anglais'
            }
        },
    },
    sizeLP: {
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
                en: 'Without "Lp"',
                fr: 'Sans "Lp"'
            },
            withLPSpace: {
                value: 3,
                en: 'With a space and "Lp"',
                fr: 'Avec un espace et "Lp"'
            },
            withLPNoSpace: {
                value: 2,
                en: 'With "Lp"',
                fr: 'Avec "Lp"'
            }
        },
    },
    sizePercent: {
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
                en: 'Without "%"',
                fr: 'Sans "%"'
            },
            withPercentSpace: {
                value: 2,
                en: 'With a space and "%"',
                fr: 'Avec un espace et "%"'
            },
            withPercentNoSpace: {
                value: 1,
                en: 'With "%"',
                fr: 'Avec "%"'
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
            default: {
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
    },
    formatNoCapitalize: {
        type: 'select', // select
        tooltip: false,
        label: {
            en: 'Formatting',
            fr: 'Mise en forme'
        },
        input: {
            default: {
                value: 0,
                en: 'No change',
                fr: 'Aucune modification'
            },
            uppercase: {
                value: 0,
                en: 'UPPERCASE',
                fr: 'MAJUSCULE'
            },
            lowercase: {
                value: 0,
                en: 'lowercase',
                fr: 'minuscule'
            }
        }
    },
    formatRank: {
        type: 'select', // select
        tooltip: false,
        label: {
            en: 'Formatting',
            fr: 'Mise en forme'
        },
        input: {
            default: {
                value: 0,
                en: 'No change',
                fr: 'Aucune modification'
            },
            roman: {
                value: 0,
                en: 'Roman numbers',
                fr: 'Chiffres romain'
            },
            number: {
                value: -2,
                en: 'Number',
                fr: 'Chiffre'
            }
        }
    }
};

//=======================================================================//
//     DATA SETTINGS                                                     //
//=======================================================================//

// TODO: supprimer, useless pour LoL
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
//     UTIL DATA (to avoid code duplication)                             //
//=======================================================================//

const someData = {
    text: {
        format: {
            default: data => data,
            lowercase: _.toLower,
            uppercase: _.toUpper,
            capitalize: _.capitalize
        }
    },
    percentage: {
        size: {
            default: data => data,
            withPercentSpace: data => data + ' %',
            withPercentNoSpace: data => data + '%'
        },
    },
    region: {
        size: {
            default: data => data,
            longFR: data => _.get({
                'euw': 'Europe Ouest',
                'na': 'Amérique du Nord',
                'eune': 'Europe Nord & Est',
                'kr': 'Corée',
                'lan': 'Amérique latine Nord',
                'las': 'Amérique latine Sud',
                'br': 'Brésil',
                'oce': 'Océanie',
                'ru': 'Russie',
                'tr': 'Turquie',
                'jp': 'Japon',
            }, data),
            longEN: data => _.get({
                'euw': 'Europe West',
                'na': 'North America',
                'eune': 'Europe Nordic & East',
                'kr': 'Korea',
                'lan': 'Latin America North',
                'las': 'Latin America South',
                'br': 'Brazil',
                'oce': 'Oceania',
                'ru': 'Russia',
                'tr': 'Turkey',
                'jp': 'Japan',
            }, data),
        }
    },
    tier: {
        size: { // setting property
            default: data => data, // setting value
            short: data => _.get({ // setting value
                'UNRANKED': 'UNRANK',
                'BRONZE': 'BRONZE',
                'SILVER': 'SILVER',
                'GOLD': 'GOLD',
                'PLATINUM': 'PLAT',
                'DIAMOND': 'DIAM',
                'MASTER': 'MASTER',
                'CHALLENGER': 'CHALL',
            }, data),
        },
        format: { // setting property
            default: data => data, // setting value
            lowercase: _.toLower, // setting value
            uppercase: _.toUpper, // setting value
            capitalize: _.capitalize // setting value
        }
    },
    rank: {
        format: {
            default: data => data,
            roman: data => data,
            number: data => _.get({
                'I': '1',
                'II': '2',
                'III': '3',
                'IV': '4',
                'V': '5'
            }, data)
        }
    },
    lp: {
        size: {
            default: data => data,
            withLPSpace: data => data + ' Lp',
            withLPNoSpace: data => data + 'Lp'
        },
        format: {
            default: data => data,
            lowercase: _.toLower,
            uppercase: _.toUpper
        }
    }
};

const someExamples = {
    percentage: {
        size: {
            default: '69',
            withPercentSpace: '69 %',
            withPercentNoSpace: '69%'
        }
    },
    username: {
        format: {
            default: 'iFonny',
            uppercase: 'iFONNY',
            lowercase: 'ifonny',
            capitalize: 'Ifonny'
        }
    },
    leagueName: {
        format: {
            default: 'Twisted Fate\'s Constellations',
            uppercase: 'TWISTED FATE\'S CONSTELLATIONS',
            lowercase: 'twisted fate\'s constellations',
            capitalize: 'Twisted fate\'s constellations'
        }
    },
    region: {
        size: { // setting property
            default: { // setting value
                format: { // setting property
                    default: 'euw',
                    uppercase: 'EUW', // setting value
                    lowercase: 'euw', // setting value
                    capitalize: 'Euw' // setting value
                }
            },
            longFR: { // setting value
                format: { // setting property
                    default: 'Europe Ouest',
                    uppercase: 'EUROPE OUEST', // setting value
                    lowercase: 'europe ouest', // setting value
                    capitalize: 'Europe ouest' // setting value
                }
            },
            longEN: { // setting value
                format: { // setting property
                    default: 'Europe West',
                    uppercase: 'EUROPE WEST', // setting value
                    lowercase: 'europe west', // setting value
                    capitalize: 'Europe west' // setting value
                }
            }
        }
    },
    tier: {
        size: { // setting property
            default: { // setting value
                format: { // setting property
                    default: 'DIAMOND',
                    uppercase: 'DIAMOND', // setting value
                    lowercase: 'diamond', // setting value
                    capitalize: 'Diamond' // setting value
                }
            },
            short: { // setting value
                format: { // setting property
                    default: 'DIAM',
                    uppercase: 'DIAM', // setting value
                    lowercase: 'diam', // setting value
                    capitalize: 'Diam' // setting value
                }
            }
        }
    },
    rank: {
        format: {
            default: 'IV',
            roman: 'IV',
            number: '4'
        }
    },
    lp: {
        size: {
            default: {
                format: {
                    default: '86',
                    uppercase: '86',
                    lowercase: '86'
                }
            },
            withLPSpace: {
                format: {
                    default: '86 Lp',
                    uppercase: '86 LP',
                    lowercase: '86 lp'
                }
            },
            withLPNoSpace: {
                format: {
                    default: '86Lp',
                    uppercase: '86LP',
                    lowercase: '86lp'
                }
            }
        }
    }
};


//=======================================================================//
//     TAGS                                                              //
//=======================================================================//

/*

 Tags : 

    - LOL__ACCOUNT__USERNAME
    - LOL__ACCOUNT__REGION
    - LOL__ACCOUNT__ID
    - LOL__ACCOUNT__LEVEL


    - LOL__TOP_SOLO_SR__LEAGUE_NAME : TODO
    - LOL__TOP_SOLO_SR__LP : TODO
    - LOL__TOP_SOLO_SR__WINS : TODO
    - LOL__TOP_SOLO_SR__LOSSES : TODO
    - LOL__TOP_SOLO_SR__GAMES : TODO
    - LOL__TOP_SOLO_SR__WINRATE : TODO
    
    - LOL__TOP_FLEX_SR__LEAGUE_NAME : TODO
    - LOL__TOP_FLEX_SR__LP : TODO
    - LOL__TOP_FLEX_SR__WINS : TODO
    - LOL__TOP_FLEX_SR__LOSSES : TODO
    - LOL__TOP_FLEX_SR__GAMES : TODO
    - LOL__TOP_FLEX_SR__WINRATE : TODO

    - LOL__TOP_FLEX_TT__LEAGUE_NAME : TODO
    - LOL__TOP_FLEX_TT__LP : TODO
    - LOL__TOP_FLEX_TT__WINS : TODO
    - LOL__TOP_FLEX_TT__LOSSES : TODO
    - LOL__TOP_FLEX_TT__GAMES : TODO
    - LOL__TOP_FLEX_TT__WINRATE : TODO


    - LOL__RANKED_SOLO_SR__LEAGUE_NAME
    - LOL__RANKED_SOLO_SR__TIER 
    - LOL__RANKED_SOLO_SR__RANK
    - LOL__RANKED_SOLO_SR__LP
    - LOL__RANKED_SOLO_SR__WINS
    - LOL__RANKED_SOLO_SR__LOSSES
    - LOL__RANKED_SOLO_SR__GAMES
    - LOL__RANKED_SOLO_SR__WINRATE

    - LOL__RANKED_FLEX_SR__LEAGUE_NAME
    - LOL__RANKED_FLEX_SR__TIER
    - LOL__RANKED_FLEX_SR__RANK
    - LOL__RANKED_FLEX_SR__LP
    - LOL__RANKED_FLEX_SR__WINS
    - LOL__RANKED_FLEX_SR__LOSSES
    - LOL__RANKED_FLEX_SR__GAMES
    - LOL__RANKED_FLEX_SR__WINRATE

    - LOL__RANKED_FLEX_TT__LEAGUE_NAME
    - LOL__RANKED_FLEX_TT__TIER
    - LOL__RANKED_FLEX_TT__RANK
    - LOL__RANKED_FLEX_TT__LP
    - LOL__RANKED_FLEX_TT__WINS
    - LOL__RANKED_FLEX_TT__LOSSES
    - LOL__RANKED_FLEX_TT__GAMES
    - LOL__RANKED_FLEX_TT__WINRATE

    - LOL__OPGG__RANK
    - LOL__OPGG__PERCENT_OF_TOP
    - LOL__OPGG__MMR
    - LOL__OPGG__SEASON_TIER


    - LOL__GAME__LAST_GAME_RESULT : TODO
    - LOL__GAME__LAST_GAME_KDA : TODO
    - LOL__GAME__LAST_GAME_LANE : TODO
    - LOL__GAME__LAST_GAME_CHAMPION : TODO
    - LOL__GAME__LAST_GAME_DAMAGE_DEALT : TODO
    - LOL__GAME__LAST_GAME_DAMAGE_TAKEN : TODO


    - LOL__CHAMPION__FIRST : TODO
    - LOL__CHAMPION__SECOND : TODO
    - LOL__CHAMPION__THIRD : TODO

    - LOL__CHAMPION__FIRST_POINTS : TODO
    - LOL__CHAMPION__SECOND_POINTS : TODO
    - LOL__CHAMPION__THIRD_POINTS : TODO

    - LOL__CHAMPION__FIRST_LEVEL : TODO
    - LOL__CHAMPION__SECOND_LEVEL : TODO
    - LOL__CHAMPION__THIRD_LEVEL : TODO

*/

module.exports = {

    LOL__ACCOUNT__USERNAME: {
        id: 'LOL__ACCOUNT__USERNAME', // gameTag ID : {GAME_ID}__{CATEGORY_SMALL}_{NAME_SMALL}
        gameID: 'lol',
        category: 'Account / Informations',
        categorySmall: 'Account',
        name: 'Username', // Tag name
        nameSmall: 'Username', // Tag small name
        size: 16, // default size
        account: true, // need account or not
        useExample: false, // Use a static data or update game data on tag creation/update (set to 'true' if strict ratelimits)
        fieldSettings: { // Settings applied to the retrieved data (ex: format, size...)
            format: fieldSettings.format // existing setting
        },
        dataSettings: {}, // Settings applied at the time of data retrieve (Like: game, category...)
        settingsOrder: ['format'], // settings order
        generator: 'default', // function called to generate data 
        data: someData.text, // existing data
        exampleOriginal: 'iFonny',
        example: someExamples.username // existing example
    },
    LOL__ACCOUNT__REGION: {
        id: 'LOL__ACCOUNT__REGION',
        gameID: 'lol',
        category: 'Account / Informations',
        categorySmall: 'Account',
        name: 'Region',
        nameSmall: 'Region',
        size: 4,
        account: true,
        useExample: false,
        fieldSettings: {
            size: fieldSettings.sizeRegion, // existing setting
            format: fieldSettings.format // existing setting
        },
        dataSettings: {},
        settingsOrder: ['size', 'format'],
        generator: 'default',
        data: {
            size: someData.region.size, // existing data
            format: someData.text.format // existing data
        },
        exampleOriginal: 'euw',
        example: someExamples.region // existing example
    },
    LOL__ACCOUNT__ID: {
        id: 'LOL__ACCOUNT__ID',
        gameID: 'lol',
        category: 'Account / Informations',
        categorySmall: 'Account',
        name: 'ID', // Tag name
        nameSmall: 'ID', // Tag small name
        size: 10, // default size
        account: true, // need account or not
        useExample: false, // Use a static data or update game data on tag creation/update (set to 'true' if strict ratelimits)
        fieldSettings: {},
        dataSettings: {},
        settingsOrder: [],
        generator: 'default',
        data: null, // because no settings
        exampleOriginal: '109009595',
        example: '109009595'
    },
    LOL__ACCOUNT__LEVEL: {
        id: 'LOL__ACCOUNT__LEVEL',
        gameID: 'lol',
        category: 'Account / Informations',
        categorySmall: 'Account',
        name: 'Level', // Tag name
        nameSmall: 'LvL', // Tag small name
        size: 5, // default size
        account: true, // need account or not
        useExample: false, // Use a static data or update game data on tag creation/update (set to 'true' if strict ratelimits)
        fieldSettings: {},
        dataSettings: {},
        settingsOrder: [],
        generator: 'default',
        data: null, // because no settings
        exampleOriginal: '103',
        example: '103'
    },



    // - LOL__TOP_SOLO_SR__LEAGUE_NAME : TODO
    // - LOL__TOP_SOLO_SR__LP : TODO
    // - LOL__TOP_SOLO_SR__WINS : TODO
    // - LOL__TOP_SOLO_SR__LOSSES : TODO
    // - LOL__TOP_SOLO_SR__GAMES : TODO
    // - LOL__TOP_SOLO_SR__WINRATE : TODO

    // - LOL__TOP_FLEX_SR__LEAGUE_NAME : TODO
    // - LOL__TOP_FLEX_SR__LP : TODO
    // - LOL__TOP_FLEX_SR__WINS : TODO
    // - LOL__TOP_FLEX_SR__LOSSES : TODO
    // - LOL__TOP_FLEX_SR__GAMES : TODO
    // - LOL__TOP_FLEX_SR__WINRATE : TODO

    // - LOL__TOP_FLEX_TT__LEAGUE_NAME : TODO
    // - LOL__TOP_FLEX_TT__LP : TODO
    // - LOL__TOP_FLEX_TT__WINS : TODO
    // - LOL__TOP_FLEX_TT__LOSSES : TODO
    // - LOL__TOP_FLEX_TT__GAMES : TODO
    // - LOL__TOP_FLEX_TT__WINRATE : TODO


    LOL__RANKED_SOLO_SR__LEAGUE_NAME: {
        id: 'LOL__RANKED_SOLO_SR__LEAGUE_NAME', // gameTag ID : {GAME_ID}__{CATEGORY_SMALL}_{NAME_SMALL}
        gameID: 'lol', // game ID
        category: 'Ranked Solo Summoner\'s Rift', // Category name
        categorySmall: 'Ranked Solo SR', // Category small name
        name: 'League name', // Tag name
        nameSmall: 'League name', // Tag small name
        size: 29, // default size
        account: true, // need account or not
        useExample: false, // Use a static data or update game data on tag creation/update (set to 'true' if strict ratelimits)
        fieldSettings: { // Settings applied to the retrieved data (ex: format, size...)
            format: fieldSettings.format // existing setting
        },
        dataSettings: {}, // Settings applied at the time of data retrieve (Like: game, category...)
        settingsOrder: ['format'], // settings order
        generator: 'default', // function called to generate data 
        data: someData.text, // existing data
        exampleOriginal: 'Twisted Fate\'s Constellations',
        example: someExamples.leagueName // existing example
    },
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
        dataSettings: {}, // Settings applied at the time of data retrieve (Like: game, category...)
        settingsOrder: ['size', 'format'], // settings order
        generator: 'default', // function called to generate data 
        data: {
            size: someData.tier.size, // existing data
            format: someData.text.format // existing data
        },
        exampleOriginal: 'DIAMOND',
        example: someExamples.tier // existing example
    },
    LOL__RANKED_SOLO_SR__RANK: {
        id: 'LOL__RANKED_SOLO_SR__RANK',
        gameID: 'lol',
        category: 'Ranked Solo Summoner\'s Rift',
        categorySmall: 'Ranked Solo SR',
        name: 'Rank',
        nameSmall: 'Rank',
        size: 3,
        account: true, // need account or not
        useExample: false, // Use a static data or update game data on tag creation/update (set to 'true' if strict ratelimits)
        fieldSettings: { // Settings applied to the retrieved data (ex: format, size...)
            format: fieldSettings.formatRank // existing setting
        },
        dataSettings: {}, // Settings applied at the time of data retrieve (Like: game, category...)
        settingsOrder: ['format'],
        generator: 'default', // function called to generate data 
        data: someData.rank, // existing data
        exampleOriginal: 'IV',
        example: someExamples.rank // existing example
    },
    LOL__RANKED_SOLO_SR__LP: {
        id: 'LOL__RANKED_SOLO_SR__LP',
        gameID: 'lol',
        category: 'Ranked Solo Summoner\'s Rift',
        categorySmall: 'Ranked Solo SR',
        name: 'League points',
        nameSmall: 'LP',
        size: 3,
        account: true, // need account or not
        useExample: false, // Use a static data or update game data on tag creation/update (set to 'true' if strict ratelimits)
        fieldSettings: { // Settings applied to the retrieved data (ex: format, size...)
            size: fieldSettings.sizeLP, // existing setting
            format: fieldSettings.formatNoCapitalize // existing setting
        },
        dataSettings: {}, // Settings applied at the time of data retrieve (Like: game, category...)
        settingsOrder: ['size', 'format'],
        generator: 'default', // function called to generate data 
        data: someData.lp, // existing data
        exampleOriginal: '86',
        example: someExamples.lp // existing example
    },
    LOL__RANKED_SOLO_SR__WINS: {
        id: 'LOL__RANKED_SOLO_SR__WINS',
        gameID: 'lol',
        category: 'Ranked Solo Summoner\'s Rift',
        categorySmall: 'Ranked Solo SR',
        name: 'Wins',
        nameSmall: 'Wins',
        size: 5,
        account: true,
        useExample: false,
        fieldSettings: {},
        dataSettings: {},
        settingsOrder: [],
        generator: 'default',
        data: null, // because no settings
        exampleOriginal: '149',
        example: '149'
    },
    LOL__RANKED_SOLO_SR__LOSSES: {
        id: 'LOL__RANKED_SOLO_SR__LOSSES',
        gameID: 'lol',
        category: 'Ranked Solo Summoner\'s Rift',
        categorySmall: 'Ranked Solo SR',
        name: 'Losses',
        nameSmall: 'Losses',
        size: 5,
        account: true,
        useExample: false,
        fieldSettings: {},
        dataSettings: {},
        settingsOrder: [],
        generator: 'default',
        data: null, // because no settings
        exampleOriginal: '102',
        example: '102'
    },
    LOL__RANKED_SOLO_SR__GAMES: {
        id: 'LOL__RANKED_SOLO_SR__GAMES',
        gameID: 'lol',
        category: 'Ranked Solo Summoner\'s Rift',
        categorySmall: 'Ranked Solo SR',
        name: 'Games',
        nameSmall: 'Games',
        size: 6,
        account: true,
        useExample: false,
        fieldSettings: {},
        dataSettings: {},
        settingsOrder: [],
        generator: 'default',
        data: null, // because no settings
        exampleOriginal: '470',
        example: '470'
    },
    LOL__RANKED_SOLO_SR__WINRATE: {
        id: 'LOL__RANKED_SOLO_SR__WINRATE',
        gameID: 'lol',
        category: 'Ranked Solo Summoner\'s Rift',
        categorySmall: 'Ranked Solo SR',
        name: 'Winrate',
        nameSmall: 'WR',
        size: 3,
        account: true,
        useExample: false,
        fieldSettings: {
            size: fieldSettings.sizePercent, // existing setting
        },
        dataSettings: {},
        settingsOrder: ['size'],
        generator: 'default',
        data: someData.percentage, // existing data
        exampleOriginal: '69',
        example: someExamples.percentage // existing example
    },



    LOL__RANKED_FLEX_SR__LEAGUE_NAME: {
        id: 'LOL__RANKED_FLEX_SR__LEAGUE_NAME',
        gameID: 'lol',
        category: 'Ranked Flex Summoner\'s Rift',
        categorySmall: 'Ranked Flex SR',
        name: 'League name',
        nameSmall: 'League name',
        size: 29,
        account: true,
        useExample: false,
        fieldSettings: {
            format: fieldSettings.format // existing setting
        },
        dataSettings: {},
        settingsOrder: ['format'],
        generator: 'default',
        data: someData.text, // existing data
        exampleOriginal: 'Twisted Fate\'s Constellations',
        example: someExamples.leagueName // existing example
    },
    LOL__RANKED_FLEX_SR__TIER: {
        id: 'LOL__RANKED_FLEX_SR__TIER',
        gameID: 'lol',
        category: 'Ranked Flex Summoner\'s Rift',
        categorySmall: 'Ranked Flex SR',
        name: 'Tier',
        nameSmall: 'Tier',
        size: 10,
        account: true, // need account or not
        useExample: false, // Use a static data or update game data on tag creation/update (set to 'true' if strict ratelimits)
        fieldSettings: { // Settings applied to the retrieved data (ex: format, size...)
            size: fieldSettings.size, // existing setting
            format: fieldSettings.format // existing setting
        },
        dataSettings: {}, // Settings applied at the time of data retrieve (Like: game, category...)
        settingsOrder: ['size', 'format'],
        generator: 'default', // function called to generate data 
        data: someData.tier, // existing data
        exampleOriginal: 'DIAMOND',
        example: someExamples.tier // existing example
    },
    LOL__RANKED_FLEX_SR__RANK: {
        id: 'LOL__RANKED_FLEX_SR__RANK',
        gameID: 'lol',
        category: 'Ranked Flex Summoner\'s Rift',
        categorySmall: 'Ranked Flex SR',
        name: 'Rank',
        nameSmall: 'Rank',
        size: 3,
        account: true, // need account or not
        useExample: false, // Use a static data or update game data on tag creation/update (set to 'true' if strict ratelimits)
        fieldSettings: { // Settings applied to the retrieved data (ex: format, size...)
            format: fieldSettings.formatRank // existing setting
        },
        dataSettings: {}, // Settings applied at the time of data retrieve (Like: game, category...)
        settingsOrder: ['format'],
        generator: 'default', // function called to generate data 
        data: someData.rank, // existing data
        exampleOriginal: 'IV',
        example: someExamples.rank // existing example
    },
    LOL__RANKED_FLEX_SR__LP: {
        id: 'LOL__RANKED_FLEX_SR__LP',
        gameID: 'lol',
        category: 'Ranked Flex Summoner\'s Rift',
        categorySmall: 'Ranked Flex SR',
        name: 'League points',
        nameSmall: 'LP',
        size: 3,
        account: true, // need account or not
        useExample: false, // Use a static data or update game data on tag creation/update (set to 'true' if strict ratelimits)
        fieldSettings: { // Settings applied to the retrieved data (ex: format, size...)
            size: fieldSettings.sizeLP, // existing setting
            format: fieldSettings.formatNoCapitalize // existing setting
        },
        dataSettings: {}, // Settings applied at the time of data retrieve (Like: game, category...)
        settingsOrder: ['size', 'format'],
        generator: 'default', // function called to generate data 
        data: someData.lp, // existing data
        exampleOriginal: '86',
        example: someExamples.lp // existing example
    },
    LOL__RANKED_FLEX_SR__WINS: {
        id: 'LOL__RANKED_FLEX_SR__WINS',
        gameID: 'lol',
        category: 'Ranked Flex Summoner\'s Rift',
        categorySmall: 'Ranked Flex SR',
        name: 'Wins',
        nameSmall: 'Wins',
        size: 5,
        account: true,
        useExample: false,
        fieldSettings: {},
        dataSettings: {},
        settingsOrder: [],
        generator: 'default',
        data: null, // because no settings
        exampleOriginal: '149',
        example: '149'
    },
    LOL__RANKED_FLEX_SR__LOSSES: {
        id: 'LOL__RANKED_FLEX_SR__LOSSES',
        gameID: 'lol',
        category: 'Ranked Flex Summoner\'s Rift',
        categorySmall: 'Ranked Flex SR',
        name: 'Losses',
        nameSmall: 'Losses',
        size: 5,
        account: true,
        useExample: false,
        fieldSettings: {},
        dataSettings: {},
        settingsOrder: [],
        generator: 'default',
        data: null, // because no settings
        exampleOriginal: '149',
        example: '149'
    },
    LOL__RANKED_FLEX_SR__GAMES: {
        id: 'LOL__RANKED_FLEX_SR__GAMES',
        gameID: 'lol',
        category: 'Ranked Flex Summoner\'s Rift',
        categorySmall: 'Ranked Flex SR',
        name: 'Games',
        nameSmall: 'Games',
        size: 6,
        account: true,
        useExample: false,
        fieldSettings: {},
        dataSettings: {},
        settingsOrder: [],
        generator: 'default',
        data: null, // because no settings
        exampleOriginal: '149',
        example: '149'
    },
    LOL__RANKED_FLEX_SR__WINRATE: {
        id: 'LOL__RANKED_FLEX_SR__WINRATE',
        gameID: 'lol',
        category: 'Ranked Flex Summoner\'s Rift',
        categorySmall: 'Ranked Flex SR',
        name: 'Winrate',
        nameSmall: 'WR',
        size: 3,
        account: true,
        useExample: false,
        fieldSettings: {
            size: fieldSettings.sizePercent, // existing setting
        },
        dataSettings: {},
        settingsOrder: ['size'],
        generator: 'default',
        data: someData.percentage, // existing data
        exampleOriginal: '69',
        example: someExamples.percentage // existing example
    },



    LOL__RANKED_FLEX_TT__LEAGUE_NAME: {
        id: 'LOL__RANKED_FLEX_TT__LEAGUE_NAME',
        gameID: 'lol',
        category: 'Ranked Flex Twisted Treeline',
        categorySmall: 'Ranked Flex TT',
        name: 'League name',
        nameSmall: 'League name',
        size: 29,
        account: true,
        useExample: false,
        fieldSettings: {
            format: fieldSettings.format // existing setting
        },
        dataSettings: {},
        settingsOrder: ['format'],
        generator: 'default',
        data: someData.text, // existing data
        exampleOriginal: 'Twisted Fate\'s Constellations',
        example: someExamples.leagueName // existing example
    },
    LOL__RANKED_FLEX_TT__TIER: {
        id: 'LOL__RANKED_FLEX_TT__TIER',
        gameID: 'lol',
        category: 'Ranked Flex Twisted Treeline',
        categorySmall: 'Ranked Flex TT',
        name: 'Tier',
        nameSmall: 'Tier',
        size: 10,
        account: true, // need account or not
        useExample: false, // Use a static data or update game data on tag creation/update (set to 'true' if strict ratelimits)
        fieldSettings: { // Settings applied to the retrieved data (ex: format, size...)
            size: fieldSettings.size, // existing setting
            format: fieldSettings.format // existing setting
        },
        dataSettings: {}, // Settings applied at the time of data retrieve (Like: game, category...)
        settingsOrder: ['size', 'format'],
        generator: 'default', // function called to generate data 
        data: someData.tier, // existing data
        exampleOriginal: 'DIAMOND',
        example: someExamples.tier // existing example
    },
    LOL__RANKED_FLEX_TT__RANK: {
        id: 'LOL__RANKED_FLEX_TT__RANK',
        gameID: 'lol',
        category: 'Ranked Flex Twisted Treeline',
        categorySmall: 'Ranked Flex TT',
        name: 'Rank',
        nameSmall: 'Rank',
        size: 3,
        account: true, // need account or not
        useExample: false, // Use a static data or update game data on tag creation/update (set to 'true' if strict ratelimits)
        fieldSettings: { // Settings applied to the retrieved data (ex: format, size...)
            format: fieldSettings.formatRank // existing setting
        },
        dataSettings: {}, // Settings applied at the time of data retrieve (Like: game, category...)
        settingsOrder: ['format'],
        generator: 'default', // function called to generate data 
        data: someData.rank, // existing data
        exampleOriginal: 'IV',
        example: someExamples.rank // existing example
    },
    LOL__RANKED_FLEX_TT__LP: {
        id: 'LOL__RANKED_FLEX_TT__LP',
        gameID: 'lol',
        category: 'Ranked Flex Twisted Treeline',
        categorySmall: 'Ranked Flex TT',
        name: 'League points',
        nameSmall: 'LP',
        size: 3,
        account: true, // need account or not
        useExample: false, // Use a static data or update game data on tag creation/update (set to 'true' if strict ratelimits)
        fieldSettings: { // Settings applied to the retrieved data (ex: format, size...)
            size: fieldSettings.sizeLP, // existing setting
            format: fieldSettings.formatNoCapitalize // existing setting
        },
        dataSettings: {}, // Settings applied at the time of data retrieve (Like: game, category...)
        settingsOrder: ['size', 'format'],
        generator: 'default', // function called to generate data 
        data: someData.lp, // existing data
        exampleOriginal: '86',
        example: someExamples.lp // existing example
    },
    LOL__RANKED_FLEX_TT__WINS: {
        id: 'LOL__RANKED_FLEX_TT__WINS',
        gameID: 'lol',
        category: 'Ranked Flex Twisted Treeline',
        categorySmall: 'Ranked Flex TT',
        name: 'Wins',
        nameSmall: 'Wins',
        size: 5,
        account: true,
        useExample: false,
        fieldSettings: {},
        dataSettings: {},
        settingsOrder: [],
        generator: 'default',
        data: null, // because no settings
        exampleOriginal: '149',
        example: '149'
    },
    LOL__RANKED_FLEX_TT__LOSSES: {
        id: 'LOL__RANKED_FLEX_TT__LOSSES',
        gameID: 'lol',
        category: 'Ranked Flex Twisted Treeline',
        categorySmall: 'Ranked Flex TT',
        name: 'Losses',
        nameSmall: 'Losses',
        size: 5,
        account: true,
        useExample: false,
        fieldSettings: {},
        dataSettings: {},
        settingsOrder: [],
        generator: 'default',
        data: null, // because no settings
        exampleOriginal: '149',
        example: '149'
    },
    LOL__RANKED_FLEX_TT__GAMES: {
        id: 'LOL__RANKED_FLEX_TT__GAMES',
        gameID: 'lol',
        category: 'Ranked Flex Twisted Treeline',
        categorySmall: 'Ranked Flex TT',
        name: 'Games',
        nameSmall: 'Games',
        size: 6,
        account: true,
        useExample: false,
        fieldSettings: {},
        dataSettings: {},
        settingsOrder: [],
        generator: 'default',
        data: null, // because no settings
        exampleOriginal: '149',
        example: '149'
    },
    LOL__RANKED_FLEX_TT__WINRATE: {
        id: 'LOL__RANKED_FLEX_TT__WINRATE',
        gameID: 'lol',
        category: 'Ranked Flex Twisted Treeline',
        categorySmall: 'Ranked Flex TT',
        name: 'Winrate',
        nameSmall: 'WR',
        size: 3,
        account: true,
        useExample: false,
        fieldSettings: {
            size: fieldSettings.sizePercent, // existing setting
        },
        dataSettings: {},
        settingsOrder: ['size'],
        generator: 'default',
        data: someData.percentage, // existing data
        exampleOriginal: '69',
        example: someExamples.percentage // existing example
    },

    // ...

};