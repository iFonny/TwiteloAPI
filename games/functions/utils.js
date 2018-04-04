module.exports = {

    getDataSize(tag, settings) {
        let size = tag.size;
        for (const settingKey in settings) {
            if (tag.fieldSettings[settingKey].input[settings[settingKey]])
                size += tag.fieldSettings[settingKey].input[settings[settingKey]].value;
            else return null;
        }
        return size;
    },

    useMeAfterEachRequest_SometimesIFeelTired(ratelimit, counter) {
        if (counter >= ratelimit.request) return new Promise(resolve => setTimeout(() => resolve(0), ratelimit.every * 1000));
        else return Promise.resolve(counter);
    }

};