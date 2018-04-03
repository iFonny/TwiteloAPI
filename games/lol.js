module.exports = {
    id: 'lol',
    small_name: 'LoL',
    name: 'League Of Legends',
    icon: '/public/images/game/lol/icon.png',
    image: '/public/images/game/lol/image.png',
    color: '#f9d380',
    ratelimit: {
        request: 300,
        every: 10, // 300 requests / 10 seconds
        total: 600 // 18 000 requests / 10 minutes
    }
};