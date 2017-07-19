import { app, dialog } from 'electron';

let debug = false;
if (process.env.NODE_ENV === 'development') {
  debug = true;
  require('electron-debug')();
} else {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const installExtensions = async () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer');

    const extensions = [
      'REACT_DEVELOPER_TOOLS',
      'REDUX_DEVTOOLS'
    ];

    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;

    try {
      for (const ext of extensions) {
        installer.default(installer[ext], forceDownload);
      }
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  }
};

async function start() {
  await installExtensions();

  const { done } = require('./store');
  await done;
}

app.on('ready', () => {
  start()
    .catch(err => dialog.showErrorBox('There\'s been an error', err.stack))
    .then(() => {
      console.log('Exiting application'); // eslint-disable-line no-console
      app.quit();
    });
});
