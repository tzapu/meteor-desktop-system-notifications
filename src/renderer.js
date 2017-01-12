const electron  = require('electron');

electron.ipcRenderer.on('notify', (event, title, text, silent, icon, data) => {
  let notification = new Notification(title, {
    body: text,
    silent,
    icon,
  });

  notification.onclick = () => {
    electron.ipcRenderer.send('notificationClicked', data);
  }
})

electron.ipcRenderer.on('setBadge', (event, text) => {
  const win = electron.remote.getCurrentWindow();
  //var NativeImage = electron.nativeImage;
  let mainWindow = win.getParentWindow();
  if ( text === 0 ) {
    mainWindow.setOverlayIcon(null, text);
  } else {
    // Create badge
    let canvas = document.createElement('canvas');
    canvas.height = 140;
    canvas.width = 140;
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.ellipse(70, 70, 70, 70, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';

    if (text.length > 2) {
      ctx.font = '75px sans-serif';
      ctx.fillText('' + text, 70, 98);
    } else if (text.length > 1) {
      ctx.font = '100px sans-serif';
      ctx.fillText('' + text, 70, 105);
    } else {
      ctx.font = '125px sans-serif';
      ctx.fillText('' + text, 70, 112);
    }

    const badgeDataURL = canvas.toDataURL();

    const img = require('electron').remote.nativeImage.createFromDataURL(badgeDataURL);
    mainWindow.setOverlayIcon(img, text);
  }
})
