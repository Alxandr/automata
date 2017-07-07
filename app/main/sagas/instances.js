import { CREATE_INSTANCE, FETCH_INSTANCES, START, setInstances } from '@shared/instances';
import { call, put, spawn, take, takeLatest } from 'redux-saga/effects';
import { exists, link, numFiles, write } from '../fs';
import { get, getAll, insert } from '../db';
import { getAppDir, osName } from '../app';
import { lock, unlock } from '@shared/window/actions';

import { dialog } from 'electron';
import { getLocal as getLocalVersions } from './versions';
import modal from './modal';
import { join as pathJoin } from 'path';
import { slug } from '@shared/utils';
import startGame from '../factorio/start';
import { submitFilter } from '@shared/window/filters';

const gameDirName = (() => {
  switch (osName) {
    case 'osx': return 'factorio.app';
    case 'win': return 'factorio';
    default: throw new Error('not implemented');
  }
})();

const linkVersion = (versionPath, instanceDir) => link(pathJoin(instanceDir, gameDirName), versionPath);

const msgBox = (() => {
  const showMsgBox = opts => new Promise(resolve => dialog.showMessageBox(null, opts, resolve));

  return opts => call(showMsgBox, opts);
})();

function* newInstanceWindowSaga(id) {
  while (true) {
    const action = yield take(submitFilter(id, 'instance-prompt'));
    const { payload: { version: versionName, name: instanceName } } = action;
    const instanceSlug = slug(instanceName);
    const versions = yield call(getLocalVersions);
    const version = versions.find(v => v.name === versionName);
    if (!version) {
      // TODO: Set form error
      throw new Error(`Version with name ${versionName} not found.`);
    }
    // TODO: Validate slug is valid (not in use)

    return { version, name: instanceName, slug: instanceSlug };
  }
}

function* showNewInstanceWindow(parent) {
  const [ exit, result ] = yield call(modal, {
    parent,
    width: 500,
    height: 245,
    module: 'new_inst'
  }, newInstanceWindowSaga);

  switch (exit) {
    case 'ok':
      return result;

    case 'cancel':
    case 'close':
    default:
      return null;
  }
}

function* createInstance({ meta: { window } = {} }) {
  const versions = yield call(getLocalVersions);
  if (versions.length === 0) {
    yield msgBox({
      type: 'info',
      buttons: ['Ok'],
      defaultId: 0,
      title: 'No versions installed',
      message: 'No factorio versions is installed. Please install one or more factorio versions before attempting to create instances.'
    });

    return;
  }

  try {
    yield put(lock(window));
    const inst = yield call(showNewInstanceWindow, window);
    if (inst === null) {
      // user canceled action
      return;
    }

    const { name, version, slug } = inst;

    // Step 1: Create instance folder
    const instanceDir = getAppDir('instances', slug);

    // Step 2: Copy game
    console.log(`Make link at ${instanceDir} pointing to ${version.path}`);
    yield call(linkVersion, version.path, instanceDir);

    // Step 3: Write config file
    const confPath = pathJoin(instanceDir, 'config.ini');
    const dataPath = pathJoin(instanceDir, 'data');
    const conf =
`
; version=2
; This is INI file: https://en.wikipedia.org/wiki/INI_file#Format
; Semicolons (;) at the beginning of the line indicate a comment. Comment lines are ignored.
[path]
read-data=__PATH__system-read-data__
write-data=${dataPath}
`;
    yield call(write, confPath, conf);

    // Step 4: Insert into database
    const doc = {
      name,
      slug,
      dir: instanceDir,
      gameVersion: version.name,
      mods: [],
      instanceVersion: null
    };
    yield call(insert, `instances/${slug}`, doc);
    yield call(fetchLocal);
  } finally {
    yield put(unlock(window));
  }
}

function* getLocal() {
  const rows = yield call(getAll, 'instances');

  return rows.map(v => v.doc);
}

const isZip = name => /.*\.zip$/.test(name);

function* fetchLocal() {
  const instances = yield call(getLocal);
  const result = new Array(instances.length);
  for (let i = 0; i < instances.length; i++) {
    // lookup icon
    const inst = { ...instances[i] };
    const { dir } = inst;
    const imgPath = pathJoin(dir, 'icon.png');
    const iconExists = yield call(exists, imgPath);
    inst.icon = iconExists ? imgPath : null;

    // lookup saves
    const saveDir = pathJoin(dir, 'data', 'saves');
    const numSaves = yield call(numFiles, saveDir, isZip);
    inst.numSaves = numSaves;

    result[i] = inst;
  }

  yield put(setInstances(result));
}

function* runThenUpdate(dir) {
  yield call(startGame, dir);
  yield call(fetchLocal);
}

function* start({ payload: instanceId }) {
  const instance = yield call(get, instanceId);
  const { dir } = instance;

  yield spawn(runThenUpdate, dir);
}

// TODO: Listen for file changes and update data accordingly
export default function* instancesSaga() {
  yield takeLatest(FETCH_INSTANCES, fetchLocal);
  yield takeLatest(CREATE_INSTANCE, createInstance);
  yield takeLatest(START, start);
}
