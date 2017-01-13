# meteor-desktop-system-notifications
 
<sup>CircleCI</sup> [![CircleCI](https://circleci.com/gh/tzapu/meteor-desktop-system-notifications.svg?style=svg)](https://circleci.com/gh/tzapu/meteor-desktop-system-notifications)

---
A plugin for [meteor-desktop](https://www.npmjs.com/package/meteor-desktop) that enabled native system notifications/toasts and icon badges.

### Usage

In your `.desktop/settings.json` add this package to your plugins list:
```json
{
    "meteor-desktop-system-notifications": {
        "version": "0.0.2"
    },
}
```

On the Meteor side you can do the following:

- To set a badge on the app's icon
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

### Changelog
- 0.0.2
    - app now gets focus when clicking a notification in windows 10
- 0.0.1
    - intial release

Lots more to do
