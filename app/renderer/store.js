import { applyMiddleware, compose, createStore } from 'redux';

import getWindowId from '@windowid';
import { ipcRenderer } from 'electron';
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
  compose(
    applyMiddleware(
      forwardToMain
    ),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);
