import { call, fork, join } from 'redux-saga/effects';

import instances from './instances';
import runWindow from './runWindow';
import versions from './versions';

function* tasks() {
  yield fork(versions);
  yield fork(instances);
}

function* mainWindow() {
  yield fork(tasks);
}

export default function* saga() {
  const mainTask = yield call(runWindow, {
    width: 1024,
    height: 728,
    module: 'root'
  }, mainWindow);

  yield join(mainTask);
}
