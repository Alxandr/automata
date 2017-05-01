import { compose } from 'redux';
import { createSelector } from 'reselect';

const versionRegex = /^(\d+)\.(\d+)\.(\d+)( .*)?$/;
const parseVersion = v => {
  const match = versionRegex.exec(v);
  if (!match) throw new Error(`Version ${v} is not a valid format.`);

  return [ match[1], match[2], match[3] ];
};

const versionCompare = ([ maj1, min1, pat1 ], [ maj2, min2, pat2 ]) => {
  if (maj1 > maj2) return 1;
  if (maj2 > maj1) return -1;
  if (min1 > min2) return 1;
  if (min2 > min1) return -1;
  if (pat1 > pat2) return 1;
  if (pat2 > pat1) return -1;
  return 0;
};

const rootSelector = state => state.versions;
const _localVersionsSelector = compose(
  state => state.local,
  rootSelector
);

export const localVersionsSelector = createSelector(
  _localVersionsSelector,
  versions => [...versions].sort((a, b) => 1 - versionCompare(parseVersion(a.name), parseVersion(b.name)))
);

export const allOnlineVersionsSelector = compose(
  state => state.online,
  rootSelector
);

export const showExperimentalSelector = compose(
  state => state.showExperimental,
  rootSelector
);

export const onlineVersionsSelector = createSelector(
  allOnlineVersionsSelector,
  showExperimentalSelector,
  (online, showExperimental) => online.filter(({ experimental }) => !experimental || showExperimental)
);

export const allVersionsSelected = createSelector(
  localVersionsSelector,
  versions => versions.every(v => v.selected)
);

export const highestLocalVersionSelector = createSelector(
  localVersionsSelector,
  versions => versions.reduce((max, next) => {
    const { parsed } = max;
    const parsedNext = parseVersion(next.name);

    if (parsed === null || versionCompare(parsedNext, parsed) > 0) {
      return { parsed: parsedNext, version: next };
    }

    return max;
  }, { parsed: null, version: null }).version
);

export const localVersionsLoadedSelector = compose(
  state => state.localLoaded,
  rootSelector
);
