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