import { DOWNLOAD, FETCH_LOCAL_VERSIONS, onlineVersionsSelector, setOnlineVersions, setVersions } from '@shared/versions';
import { call, put, select, take, takeLatest } from 'redux-saga/effects';
import { compareVersions, getGroupNames, getVersions } from '../factorio/versions';
import { get, getAll, insert, update } from '../db';
import { getAppDir, osName } from '../app';
import { isLoggedInSelector, sessionSelector } from '@shared/login';
import { link, unlink } from '../fs';
import { lock, unlock } from '@shared/window/actions';

import downloadFile from './downloadFile';
import { join as joinPath } from 'path';
import login from './login';
import modal from './modal';
import { slug } from '@shared/utils';
import { submitFilter } from '@shared/window/filters';
import unpack from '../factorio/unpack';

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
    width: 500,
    height: 200,
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
    if (!selectedVersion) return;

    const { url, name } = selectedVersion;
    const nameSlug = slug(name);
    const dlDir = getAppDir('download', 'versions');
    const filePath = joinPath(dlDir, name + ext);
    yield call(downloadFile, window, `https://www.factorio.com${url}`, filePath, session);

    const versionDir = getAppDir('versions', nameSlug);
    yield call(unpack, filePath, versionDir);
    yield call(addLocal, name, versionDir, nameSlug);
  } finally {
    yield put(unlock(window));
  }
}

function* assertVirtualVersions(versionSlug) {
  const version = yield call(get, `versions/${versionSlug}`);
  if (!version) return;

  for (const { name, slug } of getGroupNames(version.name)) {
    const virtVersion = yield call(get, `versions/${slug}`);
    if (!virtVersion) {
      // Virtual version does not exist.
      // Create it and point it at current version.
      yield call(addVirtual, name, slug, version);
      continue;
    }

    const { target: targetSlug } = virtVersion;
    const target = yield call(get, `versions/${targetSlug}`);
    if (compareVersions(version.name, target.name) > 0) {
      yield call(updateVirtual, virtVersion, version);
    }
  }
}

function* addLocal(name, path, slug) {
  yield call(insert, `versions/${slug}`, { name, path, slug, virtual: false });
  yield call(assertVirtualVersions, slug);
  yield call(fetchLocal);
}

function* addVirtual(name, slug, version) {
  const versionsDir = getAppDir('versions');
  const path = joinPath(versionsDir, slug);
  yield call(link, path, version.path);
  yield call(insert, `versions/${slug}`, { name, path, slug, virtual: true, target: version.slug });
}

function* updateVirtual(version, target) {
  yield call(unlink, version.path);
  yield call(link, version.path, target.path);
  yield call(update, { ...version, target: target.slug });
}

export function* getLocal() {
  const rows = yield call(getAll, 'versions');

  return rows.map(v => v.doc);
}

function* fetchLocal() {
  const versions = yield call(getLocal);

  yield put(setVersions(versions.map(v => ({ ...v, selected: false }))));
}

export default function* versionsSaga() {
  yield takeLatest(DOWNLOAD, browseFactorioVersions);
  yield takeLatest(FETCH_LOCAL_VERSIONS, fetchLocal);
}
