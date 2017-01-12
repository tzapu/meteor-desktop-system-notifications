/* eslint-disable no-param-reassign, no-console */
import test from 'ava';
import { Application } from 'spectron';
import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import electron from 'electron';
import { createTestApp, constructPlugin, fireEventsBusEventAndWaitForAnother, fireEventsBusEvent, send, emitWindowCreated } from 'meteor-desktop-test-suite';

async function getApp(t) {
    const app = t.context.app;
    await app.client.waitUntilWindowLoaded();
    t.is(await app.client.getWindowCount(), 1);
    return app;
}

function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    });
}

const appDir = path.join(__dirname, '..', '.testApp');

test.before(
    async () => {
        await createTestApp(appDir, 'meteor-desktop-system-notifications');
    }
);

test.after(
    () => shell.rm('-rf', appDir)
);

test.beforeEach(async (t) => {
    t.context.app = new Application({
        path: electron,
        args: [appDir],
        env: { ELECTRON_ENV: 'test' }
    });
    await t.context.app.start();
});

test.afterEach.always(async (t) => {
    try {
        // Test app saves an error.txt file if it encounters an uncaught exception.
        // It is good to see it's contents if it is present.
        const errorFile = path.join(appDir, 'error.txt');
        console.log(
            'error caught in the test app:',
            fs.readFileSync(errorFile, 'utf8')
        );
        fs.unlinkSync(errorFile);
    } catch (e) {
        // There is no error file so we are good ;)
    }
    if (t.context.app && t.context.app.isRunning()) {
        await t.context.app.stop();
    }
});

test('the test app', async t => await getApp(t));

test('if plugin confirms that it has loaded', async (t) => {
    const app = await getApp(t);
    await constructPlugin(app);
    await fireEventsBusEventAndWaitForAnother(app, 'desktopLoaded', 'systemNotifications.loaded');
});

test('if new window is created', async (t) => {
  const app = await getApp(t);
  await constructPlugin(app);
  await fireEventsBusEvent(app, 'windowCreated', app.browserWindow);
  await app.client.waitUntil((await app.client.getWindowCount()) === 2);
});

test('if new window is created', async (t) => {
  const app = await getApp(t);
  await constructPlugin(app);
  await emitWindowCreated(app);
  await fireEventsBusEventAndWaitForAnother(app, 'desktopLoaded', 'systemNotifications.loaded');
  await wait(1000);
  await send(app, 'systemNotifications', 'setBadge', 6);
  await wait(25000);
});
