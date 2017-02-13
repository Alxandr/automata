import { app, dialog } from 'electron';
import window from 'electron-window';

let debug = false;
if (process.env.NODE_ENV === 'development') {
  debug = true;
  require('electron-debug')();
}

async function start() {
  if (debug) {
    const { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, default: installExtension } = require('electron-devtools-installer');
    console.log(`Added extension: ${await installExtension(REACT_DEVELOPER_TOOLS)}`);
    console.log(`Added extension: ${await installExtension(REDUX_DEVTOOLS)}`);
  }

  console.log(`Create main window`);
  const mainWindow = window.createWindow({ width: 1024, height: 728 });
  mainWindow.showUrl(`${__dirname}/../assets/html/main.html`);

  require('./main');
}

app.on('ready', () => {
  start().catch(err => dialog.showErrorBox('There\'s been an error', err.stack));
});
