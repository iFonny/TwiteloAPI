const setting = {
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
            en: 'Text length',
            fr: 'Longueur du texte'
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
                en: 'UPPERCASE',
                fr: 'MAJUSCULE'
            },
            lowercase: {
                en: 'lowercase',
                fr: 'minuscule'
            },
            capitalize: {
                en: 'Capitalized',
                fr: 'Capitalisé'
            }
        }
    }
};

module.exports = [{
    id: 'LOL__RANKED_SOLO_SR__TIER', // Tag ID
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
        account: setting.account, // existing setting
        size: setting.size, // existing setting
        format: setting.format // existing setting
    }
}];