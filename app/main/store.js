import { applyMiddleware, createStore } from 'redux';

import createNodeLogger from 'redux-node-logger';
import createSagaMiddleware from 'redux-saga';
import { ipcMain } from 'electron';
import { reducer } from '@shared/reducer';
import saga from './sagas';

const initialState = {};
const sagaMiddleware = createSagaMiddleware();

const windows = new Set();

const getFromRenderers = store => next => {
  ipcMain.on('redux-register', (event) => {
    const { sender } = event;
    windows.add(sender);

    sender.once('destroyed', () => {
      windows.delete(sender);
    });

    const state = store.getState();
    event.returnValue = state;
  });

  ipcMain.on('redux-action', (event, action) => {
    next(action);
  });

  return action => next(action);
};

const forwardToRenderers = _store => next => {
  const sendAll = action => {
    for (const window of windows) {
      window.send('redux-broadcast', action);
    }
    next(action);
  };

  return sendAll;
};

const logger = createNodeLogger();
export const store = createStore(
  reducer,
  initialState,
  applyMiddleware(
    getFromRenderers,
    sagaMiddleware,
    logger,
    forwardToRenderers,
  ),
);

const task = sagaMiddleware.run(saga);
export const done = task.done;
