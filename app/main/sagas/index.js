import { call, cancel, fork } from 'redux-saga/effects';
import runWindow from './runWindow';
import versions from './versions';

/*const named = (name, fn) => {
  Object.defineProperty(fn, 'name', {
    value: name,
    writable: false
  });
  return fn;
};

const withProgress = fn => named(`withProgress(${fn.name})`, function* (action) {
  const { meta: { renderer } } = action;
  yield put({ type: 'LOCK_WINDOW', meta: { renderer } });
  try {
    yield* fn(action);
  } finally {
    yield put({ type: 'UNLOCK_WINDOW', meta: { renderer } });
  }
});*/

function* tasks() {
  yield fork(versions);
}

export default function* saga() {
  const subTasks = yield fork(tasks);

  yield call(runWindow, {
    width: 1024,
    height: 728,
    module: 'root'
  });

  yield cancel(subTasks);
}
