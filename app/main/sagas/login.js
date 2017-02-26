import * as formActionCreators from 'redux-form';

import { call, cancel, fork, join, put, race, take } from 'redux-saga/effects';

import { CANCEL } from '@shared/window/constants';
import mapValues from 'lodash.mapvalues';
import runWindow from './runWindow';
import { submitFilter } from '@shared/window/filters';

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

const addWindow = (fn) => named(`withWindow(${fn.name})`, (window, ...args) => {
  const action = fn(...args);
  return {
    ...action,
    meta: {
      ...action.meta,
      window
    }
  };
});

const {
  stopSubmit
} = mapValues(formActionCreators, addWindow);

function* doLogin(id) {
  while (true) {
    const { payload: { username, password } } = yield take(submitFilter(id, 'login'));
    const errors = {};
    let hasError = false;
    if (!username) {
      errors['username'] = 'Username is required.';
      hasError = true;
    }

    if (!password) {
      errors['password'] = 'Password is required';
      hasError = true;
    }

    if (hasError) {
      yield put(stopSubmit(id, 'login', errors));
      continue;
    }

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
