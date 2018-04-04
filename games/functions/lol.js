module.exports = {

    fonctionCoolQuiRecupereDesChoses: (summonerID, region) => {
        return new Promise((resolve) => {

            setTimeout(() => {
                resolve({
                    requests: 1,
                    data: {
                        username: 'iFonny',
                        soloSR: {
                            tier: 'diamond',
                            division: '3',
                            lp: '26'
                        }
                    }
                });
            }, 3000);

        });
    }

};