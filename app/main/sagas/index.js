import { fork } from 'redux-saga/effects';
import versions from '../../parts/versions/saga';

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

export default function* saga() {
  yield fork(versions);
}
