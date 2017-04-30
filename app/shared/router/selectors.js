import { createSelector } from 'reselect';
import { forWindow } from '@shared/utils';
import matchPath from 'react-router/matchPath';
import memoize from 'lodash.memoize';

export const routerDataSelector = forWindow(state => state.router);

export const locationSelector = createSelector(
  routerDataSelector,
  ({ index, entries }) => entries[index]
);

export const createMatchSelector = memoize(({ path, exact = false, strict = false }) => createSelector(
  routerDataSelector,
  (location) =>
    location && location.pathname && matchPath(location.pathname, path, { exact, strict }) || null
));
