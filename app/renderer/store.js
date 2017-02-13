import { ipcRenderer } from 'electron';
import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import { reducer } from '../reducer';

const [initialState, rendererId] = ipcRenderer.sendSync('redux-register');
const forwardToMain = _store => next => {
  const send = action => {
    if (!action.meta) {
      action = { ...action, meta: { renderer: rendererId } };
    } else {
      action = { ...action, meta: { ...action.meta, renderer: rendererId } };
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

export { rendererId };
