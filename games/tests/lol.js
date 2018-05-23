module.exports = {

    LOL__ACCOUNT__USERNAME: {
        examples: [
            'iFonny',
            'Rlco'
        ],
        settings: [{
                tagSettings: {
                    format: 'uppercase'
                },
                expected: [
                    'IFONNY',
                    'RLCO'
                ]
            },
            {
                tagSettings: {
                    format: 'lowercase'
                },
                expected: [
                    'ifonny',
                    'rlco'
                ]
            },
            {
                tagSettings: {
                    format: 'capitalize'
                },
                expected: [
                    'Ifonny',
                    'Rlco'
                ]
            }
        ]
    },

    LOL__ACCOUNT__REGION: {
        examples: [
            'euw',
            'kr'
        ],
        settings: [{
            tagSettings: {
                size: 'longFR',
                format: 'uppercase'
            },
            expected: [
                'EUROPE OUEST',
                'CORÉE'
            ]
        }, {
            tagSettings: {
                size: 'longEN',
                format: 'lowercase'
            },
            expected: [
                'europe west',
                'korea'
            ]
        }]
    }
};