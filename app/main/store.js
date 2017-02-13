import { ipcMain } from 'electron';
import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { reducer } from '../reducer';
import { init } from '../renderer/router';
import saga from './sagas';

const initialState = {};
const sagaMiddleware = createSagaMiddleware();

const windows = new Map();

const getFromRenderers = store => next => {
  ipcMain.on('redux-register', (event) => {
    const { sender } = event;
    const { id } = sender;
    windows.set(id, sender);
    next({ ...init(), meta: { renderer: id }});

    sender.once('destroyed', () => {
      windows.delete(id);
    });

    const state = store.getState();
    event.returnValue = [state, id];
  });

  ipcMain.on('redux-action', (event, action) => {
    next(action);
  });
};

const forwardToRenderers = _store => next => {
  const sendAll = action => {
    for (let window of windows.values()) {
      window.send('redux-broadcast', action);
    }
    next(action);
  };

  return sendAll;
};

const logger = createLogger({
  colors: {}
});
export const store = createStore(
  reducer,
  initialState,
  applyMiddleware(
    getFromRenderers,
    sagaMiddleware,
    logger,
    forwardToRenderers
  )
);

sagaMiddleware.run(saga);
