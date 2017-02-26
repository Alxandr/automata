import { call, cancel, fork, join, race, take } from 'redux-saga/effects';
import { CANCEL } from '@shared/window/constants';
import runWindow from './runWindow';

const named = (name, fn) => {
  Object.defineProperty(fn, 'name', {
    value: name,
    writable: false
  });
  return fn;
};

const modal = fn => named(`modal(${fn.name})`, function* (id) {
  const task = yield fork(fn, id);
  const result = yield race({
    result: join(task),
    cancel: take(({ type, meta }) => type === CANCEL && meta.window === id)
  });

  yield cancel(task);

  if (result.cancel) {
    return ['cancel'];
  }

  return ['ok', result.result];
});

function* doLogin() {
  while (true) {
    const { payload: { username, password } } = yield take('login/LOGIN');
    // TODO: do login
  }
}

export default function* login(parent) {
  const [exit, result] = yield call(runWindow, {
    modal: true,
    parent,
    width: 400,
    height: 300,
    module: 'login'
  }, modal(doLogin));

  switch (exit) {
    case 'ok':
      return result;

    case 'cancel':
    case 'close':
    default:
      return false;
  }
}
