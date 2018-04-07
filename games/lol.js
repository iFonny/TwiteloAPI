module.exports = {
    id: 'lol',
    small_name: 'LoL',
    name: 'League Of Legends',
    icon: '/public/images/game/lol/icon.png',
    image: '/public/images/game/lol/image.png',
    color: '#f9d380',
    ratelimit: {
        request: 400, // ~2400 requests / 1 minute (Max: 500/10s)
        every: 10, // 400 requests / 10 seconds
        total: 300 // 5 minutes - Game data cache 
    }
};
