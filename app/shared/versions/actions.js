import {
  DOWNLOAD,
  FETCH_LOCAL_VERSIONS,
  SET_VERSIONS
} from './constants';

export const fetchLocalVersions = () => ({
  type: FETCH_LOCAL_VERSIONS
});

export const setVersions = versions => ({
  type: SET_VERSIONS,
  payload: versions
});

export const download = () => ({
  type: DOWNLOAD
});
