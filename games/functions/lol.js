module.exports = {

    fonctionCoolQuiRecupereDesChoses: (summonerID, region) => {
        return new Promise((resolve) => {

            let data = {
                username: null,
                rankedFlexTT: {
                    leagueName: null,
                    tier: 'UNRANKED',
                    rank: null,
                    leaguePoints: null,
                    wins: null,
                    losses: null,
                    winrate: null
                },
                rankedSoloSR: {
                    leagueName: null,
                    tier: 'UNRANKED',
                    rank: null,
                    leaguePoints: null,
                    wins: null,
                    losses: null,
                    winrate: null
                },
                rankedFlexSR: {
                    leagueName: null,
                    tier: 'UNRANKED',
                    rank: null,
                    leaguePoints: null,
                    wins: null,
                    losses: null,
                    winrate: null
                }
            };

            /* 
                        const res = [{
                                "queueType": "RANKED_FLEX_TT",
                                "hotStreak": false,
                                "miniSeries": {
                                    "wins": 0,
                                    "losses": 0,
                                    "target": 3,
                                    "progress": "NNNNN"
                                },
                                "wins": 20,
                                "veteran": false,
                                "losses": 8,
                                "playerOrTeamId": "21705348",
                                "leagueName": "Zyra's Warlocks",
                                "playerOrTeamName": "Jihad Jayce",
                                "inactive": false,
                                "rank": "I",
                                "freshBlood": false,
                                "leagueId": "8cbf8150-1e39-11e8-94d7-c81f66dacb22",
                                "tier": "GOLD",
                                "leaguePoints": 100
                            },
                            {
                                "queueType": "RANKED_SOLO_5x5",
                                "hotStreak": false,
                                "wins": 74,
                                "veteran": false,
                                "losses": 65,
                                "playerOrTeamId": "21705348",
                                "leagueName": "Pantheon's Masterminds",
                                "playerOrTeamName": "Jihad Jayce",
                                "inactive": false,
                                "rank": "III",
                                "freshBlood": false,
                                "leagueId": "fca9e9a0-1269-11e8-bc14-c81f66db01ef",
                                "tier": "DIAMOND",
                                "leaguePoints": 52
                            },
                            {
                                "queueType": "RANKED_FLEX_SR",
                                "hotStreak": false,
                                "wins": 29,
                                "veteran": false,
                                "losses": 19,
                                "playerOrTeamId": "21705348",
                                "leagueName": "Skarner's Warriors",
                                "playerOrTeamName": "Jihad Jayce",
                                "inactive": false,
                                "rank": "IV",
                                "freshBlood": true,
                                "leagueId": "3c4c6310-35b2-11e8-802e-c81f66dacb22",
                                "tier": "DIAMOND",
                                "leaguePoints": 11
                            }
                        ];

             */
            data.username = 'Jihad Jayce';



            setTimeout(() => {
                resolve({
                    requests: 1,
                    data: {
                        username: 'Jihad Jayce',
                        rankedFlexTT: {
                            leagueName: 'Zyra\'s Warlocks',
                            tier: 'GOLD',
                            rank: 'I',
                            leaguePoints: 100,
                            wins: 20,
                            losses: 8,
                            winrate: 20 / (20 + 8) * 100,
                        },
                        rankedSoloSR: {
                            leagueName: 'Zyra\'s Warlocks',
                            tier: 'null',
                            rank: 'II',
                            leaguePoints: 100,
                            wins: 20,
                            losses: 8,
                            winrate: 20 / (20 + 8) * 100
                        },
                        rankedFlexSR: {
                            leagueName: 'Zyra\'s Warlocks',
                            tier: 'GOLD',
                            rank: 'I',
                            leaguePoints: 100,
                            wins: 20,
                            losses: 8,
                            winrate: 20 / (20 + 8) * 100
                        }
                    }
                });
            }, 1000);


            // TODO: Resolve data null if error
            // TODO:  else Resolve data

        });
    }

};