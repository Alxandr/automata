const key = name => `version/${name}`;

export const FETCH_LOCAL_VERSIONS = key('FETCH_LOCAL_VERSIONS');
export const SET_VERSIONS = key('SET_VERSIONS');
export const SET_ONLINE_VERSIONS = key('SET_ONLINE_VERSIONS');
export const DOWNLOAD = key('DOWNLOAD');
export const SELECT = key('SELECT');
export const SELECT_ALL = key('SELECT_ALL');
export const TOGGLE_EXPERIMENTAL = key('TOGGLE_EXPERIMENTAL');
