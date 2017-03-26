import { DOWNLOAD, FETCH_LOCAL_VERSIONS, onlineVersionsSelector, setOnlineVersions, setVersions } from '@shared/versions';
import { call, put, select, take, takeLatest } from 'redux-saga/effects';
import { getAppDir, osName } from '../app';
import { isLoggedInSelector, sessionSelector } from '@shared/login';
import { lock, unlock } from '@shared/window/actions';

import downloadFile from './downloadFile';
import { getAll } from '../db';
import { getVersions } from '../factorio/versions';
import { join as joinPath } from 'path';
import login from './login';
import modal from './modal';
import { submitFilter } from '@shared/window/filters';

const ext = (() => {
  switch (osName) {
    case 'win': return '.zip';
    case 'osx': return '.dmg';
    case 'linux': return '.tar.gz';
  }
})();

function* downloadWindowSaga(id) {
  while (true) {
    const action = yield take(submitFilter(id, 'download'));
    const { payload: { version: versionName } } = action;
    const versions = yield select(onlineVersionsSelector);
    const version = versions.find(v => v.name === versionName);
    if (!version) {
      throw new Error(`Version name '${versionName}' not found in downloaded version list. Action: ${JSON.stringify(action)}`);
    }

    return version;
  }
}

function* showDownloadWindow(parent) {
  const [ exit, result ] = yield call(modal, {
    parent,
    width: 400,
    height: 240,
    module: 'dl_factorio'
  }, downloadWindowSaga);

  switch (exit) {
    case 'ok':
      return result;

    case 'cancel':
    case 'close':
    default:
      return null;
  }
}

function* browseFactorioVersions({ meta: { window } = {} }) {
  const loggedIn = yield select(isLoggedInSelector);
  if (!loggedIn) {
    const success = yield call(login, window);

    // login was canceled
    if (!success) {
      return;
    }
  }

  try {
    yield put(lock(window));
    const session = yield select(sessionSelector);
    const onlineVersions = yield call(getVersions, session);
    const localVersions = yield call(getLocal);
    const displayVersions = onlineVersions.map(v => ({
      ...v,
      installed: !!localVersions.find(l => l.name === v.name)
    }));
    yield put(setOnlineVersions(displayVersions));
    const selectedVersion = yield call(showDownloadWindow, window);
    const { url, name } = selectedVersion;
    const dlDir = getAppDir('download', 'versions');
    const filePath = joinPath(dlDir, name + ext);
    yield call(downloadFile, window, `https://www.factorio.com${url}`, filePath, session);
    // TODO: Unpack. Copy to "versions" folder, add to db and delete downloaded archive.
  } finally {
    yield put(unlock(window));
  }
}

function* getLocal() {
  return yield call(getAll, 'versions');
}

function* fetchLocal() {
  const versions = yield call(getLocal);

  yield put(setVersions(versions));
}

export default function* versionsSaga() {
  yield takeLatest(DOWNLOAD, browseFactorioVersions);
  yield takeLatest(FETCH_LOCAL_VERSIONS, fetchLocal);
}
