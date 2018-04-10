//=======================================================================//
//     ACCOUNT SETTINGS                                                    //
//=======================================================================//

module.exports = {
    username: {
        type: 'string', // text input
        tooltip: false,
        input: false, // because string type
        label: {
            en: 'Username',
            fr: 'Nom d\'utilisateur'
        },
    },
    region: {
        type: 'select', // select
        tooltip: false,
        label: {
            en: 'Region',
            fr: 'Region'
        },
        input: {
            euw: {
                en: 'Europe West',
                fr: 'Europe Ouest'
            },
            na: {
                en: 'North America',
                fr: 'Amérique du Nord'
            },
            eune: {
                en: 'Europe Nordic & East',
                fr: 'Europe Nord & Est'
            },
            kr: {
                en: 'Korea',
                fr: 'Corée'
            },
            lan: {
                en: 'Latin America North',
                fr: 'Amérique latine Nord'
            },
            las: {
                en: 'Latin America South',
                fr: 'Amérique latine Sud'
            },
            br: {
                en: 'Brazil',
                fr: 'Brésil'
            },
            oce: {
                en: 'Oceania',
                fr: 'Océanie'
            },
            ru: {
                en: 'Russia',
                fr: 'Russie'
            },
            tr: {
                en: 'Turkey',
                fr: 'Turquie'
            },
            jp: {
                en: 'Japan',
                fr: 'Japon'
            }
        }
    },
    verify: {
        type: 'verify', // button (edition only)
        input: false, // already handled by the component
        tooltip: {
            en: 'Prove that the account belongs to you',
            fr: 'Prouver que le compte vous appartient'
        },
        label: {
            en: 'Verify my account',
            fr: 'Vérifier mon compte'
        },
    }
};