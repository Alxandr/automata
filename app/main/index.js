import { app, dialog } from 'electron';
import { createWindow } from './sagas';

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

  require('./store');
}

app.on('ready', () => {
  start().catch(err => dialog.showErrorBox('There\'s been an error', err.stack));
});
