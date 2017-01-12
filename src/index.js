import os from 'os';

const { app, BrowserWindow, ipcMain } = require('electron');
const notifier = require('electron-notifications');

/**
 * Example module.
 *
 * @param {Object} log         - Winston logger instance
 * @param {Object} skeletonApp - reference to the skeleton app instance
 * @param {Object} appSettings - settings.json contents
 * @param {Object} eventsBus   - event emitter for listening or emitting events
 *                               shared across skeleton app and every module/plugin
 * @param {Object} modules     - references to all loaded modules
 * @param {Object} settings    - module settings
 * @param {Object} Module      - reference to the Module class
 * @constructor
 */
export default class DesktopNotifier {
  constructor({ log, eventsBus, Module }) {
    this.module = new Module('systemNotifications');

    this.log = log;
    this.eventsBus = eventsBus;
    this.window = null;
    this.nativeNotifications = true;
    if ((os.platform() === 'win32' || os.platform() === 'win64') && parseFloat(os.release()) < 10) {
      //fallback notifications using electron-notifications for windows older than 10
      this.nativeNotifications = false;
    }

    this.eventsBus.on('desktopLoaded', () => {
      this.init();
    });

    this.eventsBus.on('windowCreated', (window) => {
      this.mainWindow = window;
      if (this.window === null) {
        this.window = new BrowserWindow({
          parent: window,
          width: 0,
          height: 0,
          frame: false,
          show: false,
          webPreferences: {
            devTools: false,
          },
        });
        this.window.loadURL(`file://${__dirname}/index.html`);
      }
    });
  }

  init() {
    // Do some initialization if necessary.
    this.registerApi();

    // Lets inform that the module has finished loading.
    this.eventsBus.emit('meteor-desktop-system-notifications.loaded');
  }

  registerApi() {
    ipcMain.on('notificationClicked', (event, data) => {
      this.module.send('notificationClicked', data);
    });

    this.module.on('notify', (event, { title, text, silent = true, icon = '', data }) => {
      console.log('let s notify');
      if (this.nativeNotifications) {
        this.window.webContents.send('notify', title, text, silent, icon, data);
      } else {
        //fallback notifications using electron-notifications for windows older than 10
        let electronNotifications = notifier.notify(title, {
          message: text,
          flat: true,
          duration: 6000,
          icon,
        });

        electronNotifications.on('clicked', () => {
          electronNotifications.close();
          this.module.send('notificationClicked', data);
        })
      }
    });

    this.module.on('setBadge', (event, badgeCount) => {
      let text = '';
      if (badgeCount > 0) {
        text = '' + badgeCount;
      }

      if (process.platform === 'darwin') {
        app.dock.setBadge('' + text);
      } else if ((os.platform() === 'win32' || os.platform() === 'win64')) {
        this.window.webContents.send('setBadge', text);
      }
    });
  }
}
