import { createSelector } from 'reselect';
import memoize from 'lodash.memoize';
import matchPath from 'react-router/matchPath';
import { forWindow } from '@shared/utils';

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
