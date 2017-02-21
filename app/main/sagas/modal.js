import window from 'electron-window';
import { webContents, BrowserWindow } from 'electron';
import { eventChannel, END } from 'redux-saga';
import { race, take } from 'redux-saga/effects';

const nextId = (() => {
  let id = 0;
  return () => id++;
})();

export const modal = function* modal(parent, name, options = {}) {
  if (typeof parent === 'number') {
    const wc = webContents.fromId(parent);
    parent = BrowserWindow.fromWebContents(wc);
  }

  const id = nextId();
  const windowOpts = {
    parent,
    modal: true,
    ...options
  };

  const modal = window.createWindow(windowOpts);

  const closeChannel = eventChannel(emitter => {
    let live = true;

    modal.once('closed', () => {
      if (live) {
        emitter({ type: 'MODAL_CLOSED ' });
        emitter(END);
      }
    });

    return () => {
      live = false;
    };
  });

  const success = take(action => action.type === 'MODAL_SUCCESS' && action.meta.id === id);
  const cancel = take(action => action.type === 'MODAL_CANCEL' && action.meta.id === id);
  const closed = take(closeChannel, 'MODAL_CLOSED');

  modal.showUrl(`${__dirname}/../../assets/html/modal.html`, { id, name });

  let result;
  try {
    result = yield race({
      success,
      cancel,
      closed
    });
  } finally {
    if (!modal.isDestroyed()) {
      modal.destroy();
    }
  }

  if (result.success) {
    return result.success;
  }

  throw new Error('Modal cancelled');
};
