import {
  DOWNLOAD,
  FETCH_LOCAL_VERSIONS,
  SELECT,
  SELECT_ALL,
  SET_ONLINE_VERSIONS,
  SET_VERSIONS,
} from './constants';

export const fetchLocalVersions = () => ({
  type: FETCH_LOCAL_VERSIONS
});

export const setVersions = versions => ({
  type: SET_VERSIONS,
  payload: versions
});

export const setOnlineVersions = versions => ({
  type: SET_ONLINE_VERSIONS,
  payload: versions
});

export const download = () => ({
  type: DOWNLOAD
});

export const select = (version) => ({
  type: SELECT,
  payload: version
});

export const selectAll = () => ({
  type: SELECT_ALL
});
