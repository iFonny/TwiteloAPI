module.exports = {
    id: 'lol',
    small_name: 'LoL',
    name: 'League Of Legends',
    icon: '/public/images/game/lol/icon.png',
    image: '/public/images/game/lol/image.png',
    color: '#f9d380',
    ratelimit: {
        request: 150,
        every: 10, // 150 requests / 10 seconds
        total: 600 // 9 000 requests / 10 minutes
    }
};
