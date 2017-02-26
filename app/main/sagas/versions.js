import { call, select, takeLatest } from 'redux-saga/effects';
import { DOWNLOAD } from '@shared/versions';
import { isLoggedInSelector } from '@shared/login';
import login from './login';

function* browseFactorioVersions({ meta: { window } = {} }) {
  const loggedIn = yield select(isLoggedInSelector);
  if (!loggedIn) {
    yield call(login, window);
  }

  // TODO: Implement
}

export default function* versionsSaga() {
  yield takeLatest(DOWNLOAD, browseFactorioVersions);
}
