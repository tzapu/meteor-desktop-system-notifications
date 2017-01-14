# meteor-desktop-system-notifications
 
<sup>CircleCI</sup> [![CircleCI](https://circleci.com/gh/tzapu/meteor-desktop-system-notifications.svg?style=svg)](https://circleci.com/gh/tzapu/meteor-desktop-system-notifications)

---
A plugin for [meteor-desktop](https://www.npmjs.com/package/meteor-desktop) that enabled native system notifications/toasts and icon badges.

Supports native system notifications in macOS and Windows 10 and falls back to [electron-notifications](https://github.com/blainesch/electron-notifications) for other Windows 7 & 8.

Did not test on Linux so any help is appreciated.

###### macOS app icon badge
![macOS Icon Badge](http://i.imgur.com/00ALvjK.png)
###### macOS notification
![macOS notification](http://i.imgur.com/muLnGE4.png)

###### Windows app icon badge
![Windows Icon Badge]()
###### Windows 8 notification
![Windows 8 notification]()
###### Windows 10 notification
![Windows 10 notification]()

###### Linux app icon badge
Not tested
###### Windows 8 notification
Not tested


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
