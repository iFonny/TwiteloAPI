//=======================================================================//
//     DATA FORMAT SETTINGS (to avoid code duplication)                  //
//=======================================================================//

// Settings applied to the retrieved data (ex: format, size...)
const fieldSettings = {
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
    ordinal: {
        type: 'select', // select
        tooltip: false,
        label: {
            en: 'Formatting',
            fr: 'Mise en forme'
        },
        input: {
            withoutOrdinal: {
                value: 0,
                en: 'With ordinal indicator',
                fr: 'Sans indicateur ordinal'
            },
            withOrdinal: {
                value: 2,
                en: 'Without ordinal indicator',
                fr: 'Avec indicateur ordinal'
            },
        }
    },
    timeFormat: {
        type: 'select', // select
        tooltip: false,
        label: {
            en: 'Time format',
            fr: 'Format du temps'
        },
        input: {
            default: {
                value: 0, // 6
                en: 'No change (seconds)',
                fr: 'Aucune modification (secondes)'
            },
            h_m_s_dots: {
                value: 3, // 9
                en: '2:6:12',
                fr: '2:6:12'
            },
            h_mm_ss_dots: {
                value: 3, // 9
                en: '2:06:12',
                fr: '2:06:12'
            },
            h_m_s_ms_dots: {
                value: 7, // 13
                en: '2:6:12:995',
                fr: '2:6:12:995'
            },
            h_mm_ss_ms_dots: {
                value: 7, // 13
                en: '2:06:12:995',
                fr: '2:06:12:995'
            },
            h_m_s: {
                value: 4, // 10
                en: '2h6m12s',
                fr: '2h6m12s'
            },
            h_mm_ss: {
                value: 4, // 10
                en: '2h06m12s',
                fr: '2h06m12s'
            },
            h_m_s_ms: {
                value: 9, // 15
                en: '2h6m12s995ms',
                fr: '2h6m12s995ms'
            },
            h_mm_ss_ms: {
                value: 9, // 15
                en: '2h06m12s995ms',
                fr: '2h06m12s995ms'
            },
            h_m_s_space: {
                value: 6, // 12
                en: '2h 6m 12s',
                fr: '2h 6m 12s'
            },
            h_mm_ss_space: {
                value: 6, // 12
                en: '2h 06m 12s',
                fr: '2h 06m 12s'
            },
            h_m_s_ms_space: {
                value: 12, // 18
                en: '2h 6m 12s 995ms',
                fr: '2h 6m 12s 995ms'
            },
            h_mm_ss_ms_space: {
                value: 12, // 18
                en: '2h 06m 12s 995ms',
                fr: '2h 06m 12s 995ms'
            },
        }
    },
};

//=======================================================================//
//     DATA SETTINGS (to avoid code duplication)                         //
//=======================================================================//

// Settings applied at the time of data retrieve (Like: game, category, season...)
const dataSetting = {
    game: {
        type: 'speedrun_game', // text input
        tooltip: false,
        input: false, // because string type
        label: {
            en: 'Game',
            fr: 'Jeu'
        },
    },
    category: {
        type: 'speedrun_category', // select
        tooltip: false,
        input: false, // because string type
        label: {
            en: 'Category',
            fr: 'Categorie'
        },
    }
};

//=======================================================================//
//     DATA FUNCTIONS (to avoid code duplication)                        //
//=======================================================================//

const dataFunction = {
    text: {
        format: {
            default: data => data,
            lowercase: _.toLower,
            uppercase: _.toUpper,
            capitalize: _.capitalize
        }
    },
    formatNoCapitalize: {
        default: data => data,
        lowercase: _.toLower,
        uppercase: _.toUpper
    },
    timeFormat: {
        default: data => data,
        h_m_s_dots: data => Server.moment.duration(parseFloat(data), 'seconds').format('h:m:s', {
            trim: 'both mid'
        }),
        h_mm_ss_dots: data => Server.moment.duration(parseFloat(data), 'seconds').format('h:mm:ss', {
            trim: 'both mid'
        }),
        h_m_s_ms_dots: data => Server.moment.duration(parseFloat(data), 'seconds').format('h:m:s:SSS', {
            trim: 'both mid'
        }),
        h_mm_ss_ms_dots: data => Server.moment.duration(parseFloat(data), 'seconds').format('h:mm:ss:SSS', {
            trim: 'both mid'
        }),
        h_m_s: data => Server.moment.duration(parseFloat(data), 'seconds').format('h[h]m[m]s[s]', {
            trim: 'both mid'
        }),
        h_mm_ss: data => Server.moment.duration(parseFloat(data), 'seconds').format('h[h]mm[m]ss[s]', {
            trim: 'both mid'
        }),
        h_m_s_ms: data => Server.moment.duration(parseFloat(data), 'seconds').format('h[h]m[m]s[s]SSS[ms]', {
            trim: 'both mid'
        }),
        h_mm_ss_ms: data => Server.moment.duration(parseFloat(data), 'seconds').format('h[h]mm[m]ss[s]SSS[ms]', {
            trim: 'both mid'
        }),
        h_m_s_space: data => Server.moment.duration(parseFloat(data), 'seconds').format('h[h] m[m] s[s]', {
            trim: 'both mid'
        }),
        h_mm_ss_space: data => Server.moment.duration(parseFloat(data), 'seconds').format('h[h] mm[m] ss[s]', {
            trim: 'both mid'
        }),
        h_m_s_ms_space: data => Server.moment.duration(parseFloat(data), 'seconds').format('h[h] m[m] s[s] SSS[ms]', {
            trim: 'both mid'
        }),
        h_mm_ss_ms_space: data => Server.moment.duration(parseFloat(data), 'seconds').format('h[h] mm[m] ss[s] SSS[ms]', {
            trim: 'both mid'
        }),
    },
    ordinal: {
        withoutOrdinal: data => data,
        withOrdinal: data => data + (['st', 'nd', 'rd'][(((parseInt(data) < 0 ? -parseInt(data) : parseInt(data)) + 90) % 100 - 10) % 10 - 1] || 'th'),
    },

};

//=======================================================================//
//     DATA EXAMPLES (to avoid code duplication)                         //
//=======================================================================//

const dataExample = {
    username: {
        format: {
            default: 'iFonny',
            uppercase: 'iFONNY',
            lowercase: 'ifonny',
            capitalize: 'Ifonny'
        }
    },
    ordinal: {
        format: {
            withoutOrdinal: '21',
            withOrdinal: '21st'
        }
    },
    time: {
        timeFormat: {
            default: {
                format: {
                    default: '7572',
                    uppercase: '7572',
                    lowercase: '7572'
                }
            },
            h_m_s_dots: {
                format: {
                    default: '2:6:12',
                    uppercase: '2:6:12',
                    lowercase: '2:6:12'
                }
            },
            h_mm_ss_dots: {
                format: {
                    default: '2:06:12',
                    uppercase: '2:06:12',
                    lowercase: '2:06:12'
                }
            },
            h_m_s_ms_dots: {
                format: {
                    default: '2:6:12:995',
                    uppercase: '2:6:12:995',
                    lowercase: '2:6:12:995'
                }
            },
            h_mm_ss_ms_dots: {
                format: {
                    default: '2:06:12:995',
                    uppercase: '2:06:12:995',
                    lowercase: '2:06:12:995'
                }
            },
            h_m_s: {
                format: {
                    default: '2h6m12s',
                    uppercase: '2H6M12S',
                    lowercase: '2h6m12s'
                }
            },
            h_mm_ss: {
                format: {
                    default: '2h06m12s',
                    uppercase: '2H06M12S',
                    lowercase: '2h06m12s'
                }
            },
            h_m_s_ms: {
                format: {
                    default: '2h6m12s995ms',
                    uppercase: '2H6M12S995MS',
                    lowercase: '2H6M12S995MS'
                }
            },
            h_mm_ss_ms: {
                format: {
                    default: '2h06m12s995ms',
                    uppercase: '2H06M12S995MS',
                    lowercase: '2h06m12s995ms'
                }
            },
            h_m_s_space: {
                format: {
                    default: '2h 6m 12s',
                    uppercase: '2H 6M 12S',
                    lowercase: '2h 6m 12s'
                }
            },
            h_mm_ss_space: {
                format: {
                    default: '2h 06m 12s',
                    uppercase: '2H 06M 12S',
                    lowercase: '2h 06m 12s'
                }
            },
            h_m_s_ms_space: {
                format: {
                    default: '2h 6m 12s 995ms',
                    uppercase: '2H 6M 12S 995MS',
                    lowercase: '2h 6m 12s 995ms'
                }
            },
            h_mm_ss_ms_space: {
                format: {
                    default: '2h 06m 12s 995ms',
                    uppercase: '2H 06M 12S 995MS',
                    lowercase: '2h 06m 12s 995ms'
                }
            },
        }
    },
};

//=======================================================================//
//     TAGS                                                              //
//=======================================================================//

/*

 Tags : 

 - SPEEDRUN__ACCOUNT__USERNAME
 - SPEEDRUN__ACCOUNT__ID

 - SPEEDRUN__PB__RANK
 - SPEEDRUN__PB__TIME

 - SPEEDRUN__WR__TIME : TODO 

*/

module.exports = {

    // Account infos
    SPEEDRUN__ACCOUNT__USERNAME: {
        id: 'SPEEDRUN__ACCOUNT__USERNAME', // gameTag ID : {GAME_ID}__{CATEGORY_SMALL}__{NAME_SMALL}
        gameID: 'speedrun',
        category: 'Account / Informations',
        categorySmall: 'Account',
        name: 'Username', // Tag name
        nameSmall: 'Username', // Tag small name
        size: 20, // default size
        account: true, // need account or not
        useExample: false, // Use a static data or update game data on tag creation/update (set to 'true' if strict ratelimits)
        fieldSettings: { // Settings applied to the retrieved data (ex: format, size...)
            format: fieldSettings.format // existing setting
        },
        dataSettings: {}, // Settings applied at the time of data retrieve (Like: game, category...)
        settingsOrder: ['format'], // settings order
        generator: 'default', // function called to generate data 
        data: dataFunction.text, // existing data
        exampleOriginal: 'iFonny',
        example: dataExample.username // existing example
    },
    SPEEDRUN__ACCOUNT__ID: {
        id: 'SPEEDRUN__ACCOUNT__ID', // gameTag ID : {GAME_ID}__{CATEGORY_SMALL}_{NAME_SMALL}
        gameID: 'speedrun',
        category: 'Account / Informations',
        categorySmall: 'Account',
        name: 'ID',
        nameSmall: 'ID',
        size: 10,
        account: true,
        useExample: false,
        fieldSettings: {},
        dataSettings: {},
        settingsOrder: [],
        generator: 'default',
        data: null, // because no settings
        exampleOriginal: '8yvn148m',
        example: '8yvn148m'
    },

    // Personal bests
    SPEEDRUN__PB__RANK: {
        id: 'SPEEDRUN__PB__RANK',
        gameID: 'speedrun',
        category: 'Personal best',
        categorySmall: 'PB',
        name: 'Rank',
        nameSmall: 'Rank',
        size: 4,
        account: true,
        useExample: false,
        fieldSettings: {
            format: fieldSettings.ordinal
        },
        dataSettings: {
            game: dataSetting.game,
            category: dataSetting.category
        },
        settingsOrder: ['format'],
        generator: 'default',
        data: {
            format: dataFunction.ordinal // existing data
        },
        exampleOriginal: '21',
        example: dataExample.ordinal
    },
    SPEEDRUN__PB__TIME: {
        id: 'SPEEDRUN__PB__TIME',
        gameID: 'speedrun',
        category: 'Personal best',
        categorySmall: 'PB',
        name: 'Time',
        nameSmall: 'Time',
        size: 6,
        account: true,
        useExample: false,
        fieldSettings: {
            timeFormat: fieldSettings.timeFormat,
            format: fieldSettings.formatNoCapitalize
        },
        dataSettings: {
            game: dataSetting.game,
            category: dataSetting.category
        },
        settingsOrder: ['timeFormat', 'format'],
        generator: 'default',
        data: {
            timeFormat: dataFunction.timeFormat, // existing data
            format: dataFunction.formatNoCapitalize // existing data
        },
        exampleOriginal: '7572',
        example: dataExample.time
    },

    // - SPEEDRUN__WR__TIME : TODO 

};