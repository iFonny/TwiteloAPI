//=======================================================================//
//     GAME SETTINGS                                                     //
//=======================================================================//

module.exports = {
    id: 'lol',
    small_name: 'LoL',
    name: 'League Of Legends',
    icon: '/public/images/game/lol/icon.png',
    image: '/public/images/game/lol/image.png',
    color: '#f9d380',
    ratelimit: {
        request: 50, // (Max: 500/10s) // TODO: repasser a 200 quand prod
        every: 5, // 200 requests / 5 seconds
        total: 300 // 5 minutes - Game data cache 
    }
};