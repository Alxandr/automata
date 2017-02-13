import { call, takeLatest } from 'redux-saga/effects';
import { getVersions } from '../factorio/versions';
import { login } from './login';

const fetchFactorioVersions = function* (action) {
  let versions = yield call(getVersions);
  if (versions === 'NEED_LOGIN') {
    yield call(login, action.meta.renderer);
    versions = yield call(getVersions);

    if (versions === 'NEED_LOGIN') {
      throw new Error('Login failed');
    }
  }

  console.log(JSON.stringify(versions));
};

const saga = function* () {
  yield takeLatest('FETCH_FACTORIO_VERSIONS', fetchFactorioVersions);
};

export default saga;
