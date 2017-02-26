import { ipcRenderer } from 'electron';
import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
import getWindowId from '@windowid';
import { reducer } from '@shared/reducer';

const initialState = ipcRenderer.sendSync('redux-register');
const forwardToMain = _store => next => {
  const send = action => {
    if (!action.meta) {
      action = { ...action, meta: { window: getWindowId() } };
    } else {
      action = { ...action, meta: { ...action.meta, window: getWindowId() } };
    }

    ipcRenderer.send('redux-action', action);
  };

  ipcRenderer.on('redux-broadcast', (event, msg) => {
    next(msg);
  });

  return send;
};

export const store = createStore(
  reducer,
  initialState,
  applyMiddleware(
    forwardToMain,
    createLogger()
  )
);
