router.get('/v4migration', async (req, res) => {
  if (req.user.id == '6155ff1b-9276-416c-8abb-2c910ff4d099') {
    try {
      const accounts = await Server.fn.dbMethods.account.getAllWithFilter({ game_id: 'lol' });

      let counter = 0;

      for (const account of accounts) {
        const fakeUser = await Server.fn.dbMethods.user.get(account.user_id);

        await Server.fn.routes.account
          .getAccountID(fakeUser, account)
          .then(account => Server.fn.routes.account.updateAccountSettings(fakeUser.id, account))
          .then(() => console.log(`${account.settings.username} - ${account.settings.region} updated.`))
          .catch(async err => {
            if (typeof err == 'object' && err.status == 404) {
              counter += 1;
              console.log(`ERR: ${account.settings.username} - ${account.settings.region} invalid. (${account.id})`);
              await Server.fn.routes.account
                .getTagsToDelete(fakeUser.id, account.id)
                .then(data => Server.fn.routes.account.deleteTagsFromProfile(fakeUser, data))
                .then(data => Server.fn.routes.account.deleteTagsAndAccount(fakeUser.id, data.account, data.tags))
                .catch(console.error);
            } else console.log(err);
          });
      }

      res.status(200).json({ res: counter });
    } catch (error) {
      console.error(error);
      res.status(500).json({ err: 'ono' });
    }
  } else res.status(500).json({ err: 'pas le droit xd' });
});
