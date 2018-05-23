//=======================================================================//
//     Notification Bot                                                  //
//=======================================================================//

module.exports = class NotificationBot {

    pullDatabaseChanges() {
        r.table('notification').changes()
            .filter(r.row('old_val').eq(null)).run()
            .then((feed) => {
                feed.each((err, change) => {
                    if (!err) {
                        const notification = change.new_val;

                        if (notification.destination && notification.destination != 'global') {
                            Server.fn.dbMethods.user.get(notification.destination)
                                .then(user => !user || this.sendTwitterNotification(user, notification))
                                .catch(err => __logError('[DB changes] can\'t get user', err));
                        }
                    } else __logError('[DB changes] unknown error (feed)', err);

                });
            }).error((err) => __logError('[DB changes] unknown error', err));
    }

    sendTwitterNotification(user, notification) {
        if (user.settings.notifications.mp_twitter) {
            Server.twitterBot.post('direct_messages/events/new', {
                event: {
                    type: 'message_create',
                    message_create: {
                        target: {
                            recipient_id: user.twitter_id
                        },
                        message_data: {
                            text: user.settings.locale == 'fr' ? notification.fr.content : notification.en.content
                        }
                    }
                }
            }, (errorMP) => {
                if (errorMP) __logWarning(`[NOTIFICATION] Can't send MP to @${user.username}`, errorMP);
            });
        }
    }

};