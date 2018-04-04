module.exports = {

    fonctionCoolQuiRecupereDesChoses: (accountInfo, region) => {
        return new Promise((resolve) => {

            setTimeout(() => {
                resolve({
                    username: 'iFonny',
                    soloSR: {
                        tier: 'diamond',
                        division: '3',
                        lp: '26'
                    }
                });
            }, 3000);

        });
    }

};