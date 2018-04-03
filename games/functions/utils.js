//=======================================================================//
//     ERROR functions                                                   //
//=======================================================================//

module.exports = {

    getDataSize: (tag, settings) => {
        let size = tag.size;
        for (const settingKey in settings) {
            if (tag.fieldSettings[settingKey].input[settings[settingKey]])
                size += tag.fieldSettings[settingKey].input[settings[settingKey]].value;
            else return null;
        }
        return size;
    }

};