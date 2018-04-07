module.exports = {
    id: 'speedrun',
    small_name: 'Speedrun',
    name: 'Speedrun.com',
    icon: '/public/images/game/speedrun/icon.png',
    image: '/public/images/game/speedrun/image.png',
    color: '#d68548',
    ratelimit: {
        request: 12, // ~72 requests / 1 minute (Max: 100/60s)
        every: 10, // 13 requests / 10 seconds
        total: 300 // 5 minutes - Game data cache 
    }
};