//=======================================================================//
//     Node packages                                                     //
//=======================================================================//

global._ = require('lodash');
require('chai').should();

const glob = require('glob');
const path = require('path');

//=======================================================================//
//     Getting games tags, api and test settings                         //
//=======================================================================//

let games = [];
const root = path.normalize(`${__dirname}/..`);

glob.sync(`${root}/games/tests/*.js`).forEach((file) => {
    const name = path.basename(file, '.js');

    // Require game tags, api, tests
    games.push({
        game: require(`${root}/games/${name}`),
        tags: require(`${root}/games/tags/${name}`),
        api: require(`${root}/games/api/${name}`),
        tests: require(`${root}/games/tests/${name}`)
    });
});

//=======================================================================//
//     Tests game tags                                                   //
//=======================================================================//

for (const game of games) {

    describe(`Game : ${game.game.name}`, () => {

        for (const tagIndex in game.tags) {
            const tag = game.tags[tagIndex];
            const generator = game.api.generator[tag.generator];
            const defaultSettings = _.mapValues(tag.fieldSettings, () => 'default');
            const settings = game.tests[tag.id] && Array.isArray(game.tests[tag.id].settings) ? game.tests[tag.id].settings : [];
            const examples = game.tests[tag.id] && Array.isArray(game.tests[tag.id].examples) ? game.tests[tag.id].examples : [tag.exampleOriginal];

            describe(`Tag : ${tag.id} (${tag.name})`, () => {

                for (const exampleIndex in examples) {

                    describe(`Data : ${examples[exampleIndex]}`, () => {

                        it('With default settings', function () {
                            const dataSize = getDataSize(tag, defaultSettings);
                            const data = generator(tag, examples[exampleIndex], defaultSettings);

                            dataSize.should.be.a('number');
                            data.should.be.a('string');
                            data.should.have.lengthOf.at.least(1);
                            data.should.have.lengthOf.at.most(dataSize);
                            data.should.be.equal(examples[exampleIndex]);
                        });

                        for (const setting of settings) {
                            it(`With settings : ${JSON.stringify(setting.tagSettings)}`, function () {
                                const dataSize = getDataSize(tag, setting.tagSettings);
                                const data = generator(tag, examples[exampleIndex], setting.tagSettings);

                                dataSize.should.be.a('number');
                                data.should.be.a('string');
                                data.should.have.lengthOf.at.least(1);
                                data.should.have.lengthOf.at.most(dataSize);
                                data.should.be.equal(setting.expected[exampleIndex]);
                            });
                        }

                    });

                }

            });

        }

    });

}

//=======================================================================//
//     Utils functions                                                   //
//=======================================================================//

function getDataSize(tag, settings) {
    let size = tag.size;

    for (const settingKey in settings) {
        if (tag.fieldSettings[settingKey].input[settings[settingKey]])
            size += tag.fieldSettings[settingKey].input[settings[settingKey]].value;
        else return null;
    }
    return size;
}