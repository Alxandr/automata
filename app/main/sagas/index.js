import { buffers, channel } from 'redux-saga';
import { call, cancel, fork, takeEvery } from 'redux-saga/effects';
import runWindow, { doWithWindow } from './runWindow';

import versions from './versions';

const mainHandlers = {
  'PROGRESS': function* progress(id, action) {
    doWithWindow(id, win => {
      win.setProgressBar(action.payload);
    });
  }
};

function* handleAction(id, action) {
  const handler = mainHandlers[action.type];
  if (!handler) {
    throw new Error(`Handler for action type ${action.type} not found (mainWindow)`);
  }

  yield call(handler, id, action);
}

const rootChannel = channel(buffers.expanding());
function* mainWindow(id) {
  yield takeEvery(rootChannel, id, handleAction);
}

function* tasks() {
  yield fork(versions);
}

export default function* saga() {
  const subTasks = yield fork(tasks);

  yield call(runWindow, {
    width: 1024,
    height: 728,
    module: 'root'
  }, mainWindow);

  yield cancel(subTasks);
}
