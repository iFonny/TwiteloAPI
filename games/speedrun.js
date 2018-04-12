//=======================================================================//
//     GAME SETTINGS                                                     //
//=======================================================================//

module.exports = {
    id: 'speedrun',
    small_name: 'Speedrun',
    name: 'Speedrun.com',
    icon: '/public/images/game/speedrun/icon.png',
    image: '/public/images/game/speedrun/image.png',
    color: '#d68548',
    ratelimit: {
        request: 6, // (Max: 100/60s)
        every: 5, // 13 requests / 10 seconds
        total: 60 * 5 // 5 minutes - Game data cache 
    }
};