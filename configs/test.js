const config = {
    env: 'test',
    server: {
        name: 'api-test',
        url: 'localhost',
        websiteURL: 'https://api-test.twitelo.me',
        port: 3032
    },
    media: {
        url: 'https://api-test.twitelo.me/public/media',
        path: {
            root: '/public/media/test'
        }
    },
    logs: {
        discord: false
    },
    db: {
        name: 'twitelo_test'
    }
};

// Exports module
module.exports = config;