# meteor-desktop-system-notifications
A plugin for [meteor-desktop](https://www.npmjs.com/package/meteor-desktop) that enabled native system notifications/toasts and icon badges

On the Meteor side you can do the following:

- To set an badge on the app's icon
```
Desktop.send('systemNotifications', 'setBadge', unreadCount);
```

- To show a system notification
```
Desktop.send('systemNotifications', 'notify', {
    title: 'Title',
    text: 'Text',
    icon: 'Icon Url',
    data: {
      someVar: 'someValue',
    },
});
```

- To handle click on a notification
```
Desktop.on('systemNotifications', 'notificationClicked', (sender, data) => {
    //handle click
    //data is the data object you passed to notify
});
```

Lots more to do
