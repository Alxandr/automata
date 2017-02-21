import {
  FETCH_LOCAL_VERSIONS,
  SET_VERSIONS,
  DOWNLOAD
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
