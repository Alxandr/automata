import { takeLatest, call, put } from 'redux-saga/effects';
import { FETCH_LOCAL_VERSIONS } from './constants';
import { setVersions } from './actions';
import { getAppDir } from '../../app';
import { getAll } from '../../db';

const getVersionsDir = () => getAppDir('versions');

function* fetchLocal() {
  const versions = yield call(getAll, 'versions');

  yield put(setVersions(versions));
}

export default function* versions() {
  yield takeLatest(FETCH_LOCAL_VERSIONS, fetchLocal);
}
