module.exports = {
    id: 'speedrun',
    small_name: 'Speedrun',
    name: 'Speedrun.com',
    icon: '/public/images/game/speedrun/icon.png',
    image: '/public/images/game/speedrun/image.png',
    color: '#d68548',
    ratelimit: {
        request: 30,
        every: 60, // 30 requests / 1 minute
        total: 1800 // 900 requests / 30 minutes
    }
};