import * as formActionCreators from 'redux-form';

import { call, put, take } from 'redux-saga/effects';
import { lock, unlock } from '@shared/window/actions';

import attemptLogin from '../factorio/login';
import mapValues from 'lodash.mapvalues';
import modal from './modal';
import { setLogin } from '@shared/login/actions';
import { submitFilter } from '@shared/window/filters';

const named = (name, fn) => {
  Object.defineProperty(fn, 'name', {
    value: name,
    writable: false
  });
  return fn;
};

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

    yield put(lock(id));
    const session = yield call(attemptLogin, username, password);
    yield put(unlock(id));
    if (session === null) {
      yield put(stopSubmit(id, 'login', { password: 'Wrong login' }));
      continue;
    }

    return session;
  }
}

export default function* login(parent) {
  const [ exit, result ] = yield call(modal, {
    parent,
    width: 400,
    height: 300,
    module: 'login'
  }, doLogin);

  switch (exit) {
    case 'ok':
      yield put(setLogin(result));
      return true;

    case 'cancel':
    case 'close':
    default:
      return false;
  }
}
