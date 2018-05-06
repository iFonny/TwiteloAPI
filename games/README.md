# Add a game / platform 

[Français](LISEZMOI.md) | [English](README.md)


Everything happens in the `games` folder which is separated like this:
 - 1 file for each game.
 - 1 subfolder `class` for custom classes or libs.
 - 4 subfolders (which also contain a file for each game).
    - [`api`](#game-file-in-api): Retrieving and updating game data.
    - [`functions`](#game-file-in-functions): Game functions.
    - [`settings`](#game-file-in-settings): Game account settings.
    - [`tags`](#game-file-in-tags): Game tags (data) settings.



## Main config game file: `<GAME_ID>.js`
❗ File name: `<GAME_ID>.js`
> Path: `/games/<GAME_ID>.js`

**Javascript** file which contains the basic settings of the game.

- **icon**: Path to the game icon (PNG | ~200x200) [/public/images/game/<GAME_ID>](../public/images/game).
- **image**: Path to the game image (PNG | Must make it clear what game it is and must be a long horizontal image) [/public/images/game/<GAME_ID>](../public/images/game)
- **ratelimit**: ❗ Important: Always leave some margin with the ratelimits imposed by the game (~15%)
- **...**: Check [example file](game.js.example) 

Examples: 
- [/games/game.js.example](game.js.example)
- [/games/lol.js](lol.js)
- [/games/speedrun.js](speedrun.js)



## Subfolder `class`
> Path: `/games/class/`

Folder to add its own libs, free filename (no duplicate name ofc).

(Accessible in code from `Server.class.game.<FILE_NAME>`)

Example: [/games/class/OPGG.js](class/OPGG.js)



## Game file in `api`
❗ File name: `<GAME_ID>.js`
> Path: `/games/api/<GAME_ID>.js`


**Javascript** file that contains functions to get game data. 

Separated into 3 **functions** and an **object** generator:
- **getAccountInfo**: Function called when adding an account. Allows you to retrieve information from an account (id, region..).
    - Success: *Resolve* an `object` that contains the account informations (id, region..)
    - Error:
        - *Resolve* `null` if the added account is incorrect (ex: bad username, not found...)
        - *Reject* an error if server error (ex: request timeout) 
- **getDataOneByOne**: Function that allows to retrieve and update the game data of the user tags.
    - ❗ Important: Use the `await Server.fn.game.utils.useMeBeforeEachRequest` function before each game request.
    - ❗ Important: Use the `Server.fn.game.utils.useMeAfterEachRequest` function after each game request.
- **updateFullGameData**: *[Can be copied without modification]* Change only if an optimization is required (ex: batch). Function that will call `getDataOneByOne` for all game data to update.
- **generator**: *[Can be copied without modification]* Object that contains functions that will generate data based on tag settings. Will call the specific functions to each tag/data setting (see [tags](#fichier-du-jeu-dans-tags)).

Examples: 
- [/games/api/game.js.example](api/game.js.example)
- [/games/api/lol.js](api/lol.js)
- [/games/api/speedrun.js](api/speedrun.js)



## Game file in `settings`
❗ File name: `<GAME_ID>.js`
> Path: `/games/settings/<GAME_ID>.js`

**Javascript** file that contains the account settings (game account) config, used to generate the add/edit account form.

Each `key: value` corresponds to a setting (ex: username, region..).

Each setting must have: 
- **label**: Text that will be displayed in front of the input.
- **tooltip** (can be `false`): Displays a small help icon with more information.
- **type**: Input type (*string* or *select*).
- **input**: Input content according to type (ex: Object with different choices for *select* type).

Examples: 
- [/games/settings/game.js.example](settings/game.js.example)
- [/games/settings/lol.js](settings/lol.js)
- [/games/settings/speedrun.js](settings/speedrun.js)



## Game file in `tags`
❗ File name : `<GAME_ID>.js`
> Path : `/games/tags/<GAME_ID>.js` 

**Javascript** file which contains the settings/functions of the tags/game data. Divided into 5 parts to avoid code duplication (because many settings are used several times).
- **DATA FORMAT SETTINGS**: Part that contains data formatting settings (text modification, size...).
- **DATA SETTINGS**: Part that contains the settings applied at the time of data retrieve (ex: season, category...).
- **DATA FUNCTIONS**: Part that contains the functions to be applied to the data according to the settings.
- **DATA EXAMPLES**: Part that contains example data.
- **TAGS**: List of tags with their info/settings (Objects `TAG_ID:TAG_SETTINGS`).


Each tag must have: 
- **id**: A unique identifier (ex: `SPEEDRUN__PB__RANK`).
    - norm : `<GAME_ID>__<CATEGORY_SMALL>__<NAME_SMALL>`
- **gameID**: Game ID (ex: `speedrun`).
- **category**: Full name of the category (ex: `Ranked Solo Summoner\'s Rift`).
- **categorySmall**: Short name of the category (ex: `Ranked Solo SR`).
- **name**: Full name of the tag (ex: `Winrate`).
- **nameSmall**: Short name of the tag (ex: `WR`).
- **size**: Default tag size in the profile (Max data size with default settings).
- **account**: (`true` or `false`) If the tag needs an account to work.
- **useExample**: (`true` or `false`) If the tag must use an example instead of making requests to get the data when the tag is added. Set to `true` if the ratelimits are very strict.
- **fieldSettings**: Settings used to generate the add/edit tag form. Data formatting settings (text modification, size..) (`SETTING_ID: SETTING_OBJECT`). Each setting must have: 
    - **label**: Text that will be displayed in front of the input.
    - **tooltip** (can be `false`): Displays a small help icon with more information.
    - **type**: Input type (*select*).
    - **input**: Input content according to type (ex: Object with different choices for *select* type).
- **dataSettings**: Settings used to generate the add/edit tag form. Settings applied at the time of data retrieve (ex: season, category..) (`SETTING_ID: SETTING_OBJECT`). Each setting must have:
    - **label**: Text that will be displayed in front of the input.
    - **tooltip** (can be `false`): Displays a small help icon with more information.
    - **type**: Input type (*select*).
    - **input**: Input content according to type (ex: Object with different choices for *select* type).
        - Each input contains a `value` that +/- the size of the data (ex for a *short* setting: `value: -4`)
- **settingsOrder**: Order in which the settings (❗ only formatting/*fieldSettings* settings) should be applied (ex: `['size', 'format']`).
- **generator**: Function of the data generator to call. `default` If no changes are made to the generator (ex: `default`).
- **data**: Object that contains, for each setting, functions used to format the data (❗ only formatting/*fieldSettings* settings) (`SETTING_ID: SETTING_OBJECT`). Each setting is composed of one function per value.

    Example for a setting `size` (that contains  `default`, `withPercentSpace` and `withPercentNoSpace`): 
    ```js
    size: {
        default: data => data,
        withPercentSpace: data => data + ' %',
        withPercentNoSpace: data => data + '%'
    }
    ```
- **exampleOriginal**: Original example data (ex: `DIAMOND`)
- **example**: Object that contains all example data for all possible combinations (In order).

    Example for a tag that has settings `size` (that contains `default` and `short`) and `format` (that contains `default`, `uppercase`, `lowercase` et `capitalize`) : 
    ```js
    size: { // setting PROPERTY
        default: { // setting VALUE
            format: { // setting PROPERTY
                default: 'DIAMOND', // setting VALUE
                uppercase: 'DIAMOND', // setting VALUE
                lowercase: 'diamond', // setting VALUE
                capitalize: 'Diamond' // setting VALUE
            }
        },
        short: { // setting VALUE
            format: { // setting PROPERTY
                default: 'DIAM', // setting VALUE
                uppercase: 'DIAM', // setting VALUE
                lowercase: 'diam', // setting VALUE
                capitalize: 'Diam' // setting VALUE
            }
        }
    }
    ```

Examples : 
- [/games/tags/game.js.example](tags/game.js.example)
- [/games/tags/lol.js](tags/lol.js)
- [/games/tags/speedrun.js](tags/speedrun.js)



## Game file in `functions`
❗ File name : `<GAME_ID>.js`
> Path : `/games/functions/<GAME_ID>.js`

**Javascript** file which contains the functions related to the game. Separated from [api](#fichier-du-jeu-dans-api) file for more cleanliness.

Examples : 
- [/games/functions/lol.js](functions/lol.js)
- [/games/functions/speedrun.js](functions/speedrun.js)


