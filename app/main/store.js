import { ipcMain } from 'electron';
import { applyMiddleware, createStore } from 'redux';
import createNodeLogger from 'redux-node-logger';
import createSagaMiddleware from 'redux-saga';
import { reducer } from '@shared/reducer';
import saga from './sagas';

const initialState = {};
const sagaMiddleware = createSagaMiddleware();

const windows = [];

const getFromRenderers = store => next => {
  ipcMain.on('redux-register', (event) => {
    const { sender } = event;
    windows.push(sender);

    sender.once('destroyed', () => {
      const index = windows.indexOf(sender);
      windows.splice(index, 1);
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
    for (let window of windows) {
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
    forwardToRenderers
  )
);

sagaMiddleware.run(saga);
