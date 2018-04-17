class OPGG {
    constructor(region, debug) {
        if (!region) throw Error('OPGG: region is missing.');
        this.region = region.toLowerCase();
        this.debug = debug;

        this.cheerio = require('cheerio');
        this.axios = require('axios').create({
            baseURL: `http://${region == 'kr' ? '' : region}.op.gg`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'opgg-mmr'
            }
        });
    }

    renew(summonerID) {
        return this.axios.get(`/summoner/ajax/renew.json/summonerId=${summonerID}`)
            .then((res) => {
                if (res.status == 200) {
                    const html = res.data;
                    const $ = this.cheerio.load(html);
                    let error = $('.SectionHeadLine');

                    if (error.length) {
                        error = error.text();
                        if (error.includes('Cannot find summoner name') || error.includes('An error has occurred'))
                            throw Error(`OPGG: summonner '${summonerID}' not found.`);
                        else throw Error('OPGG: Ratelimited.');
                    }

                    !this.debug || console.log(`OPGG: summonner '${summonerID}' renewed.`);
                    return true;
                } else throw Error(`OPGG: Can't renew (status code: ${res.status}).`);
            })
            .catch((error) => {
                if (error.response && error.response.status == 418) {
                    !this.debug || console.error(`OPGG: summonner '${summonerID}' already renewed.`);
                    return false;
                } else throw error;
            });
    }

    getMMR(summonerName) {
        return this.axios.get(`/summoner/ajax/mmr/summonerName=${summonerName}`)
            .then((res) => {
                if (res.status == 200) {
                    const html = res.data;
                    const $ = this.cheerio.load(html);
                    let mmr = $('.MMR').text().trim().replace(/,/g, '');
                    return parseInt(mmr, 10) || null;
                } else throw Error(`OPGG: Can't get mmr (status code: ${res.status}).`);
            })
            .catch((error) => {
                if (error.response && error.response.status == 418) {
                    !this.debug || console.error(`OPGG: summonner '${summonerName}' not found or not enough games.`);
                    return null;
                } else throw error;
            });
    }

    getSummoner(summonerName) {
        return this.axios.get(`/summoner/header/userName=${summonerName}`)
            .then((res) => {
                if (res.status == 200) {
                    const html = res.data;
                    const $ = this.cheerio.load(html);
                    let error = $('.SectionHeadLine');

                    if (error.length) {
                        error = error.text();
                        if (error.includes('Cannot find summoner name') || error.includes('An error has occurred'))
                            throw Error(`OPGG: summonner '${summonerName}' not found.`);
                        else throw Error('OPGG: Ratelimited.');
                    }

                    let summoner = {
                        rank: null,
                        percentOfTop: null,
                        seasons: {
                            S3: null,
                            S4: null,
                            S5: null,
                            S6: null,
                            S7: null
                        }
                    };

                    summoner.rank = parseInt($('.LadderRank .ranking').text().trim().replace(/,/g, ''), 10) || null;
                    summoner.percentOfTop = $('.LadderRank a').text().trim().match(/([0-9.]+)%/);
                    summoner.percentOfTop = parseFloat(summoner.percentOfTop ? summoner.percentOfTop[1] : null) || null;

                    $('.PastRankList .Item').each(function () {
                        let oldSeason = $(this).text().trim().split(' ');
                        if (oldSeason.length == 2) summoner.seasons[oldSeason[0]] = oldSeason[1].trim().substr(0, 10).toUpperCase();
                    });

                    return summoner;
                } else throw Error(`OPGG: Can't get summoner (status code: ${res.status}).`);
            });
    }

}

module.exports = OPGG;