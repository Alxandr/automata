import { call } from 'redux-saga/effects';
import { modal } from './modal';

export const login = function* login(parent) {
  yield call(modal, parent, 'login', {
    width: 480,
    height: 350
  });
};
