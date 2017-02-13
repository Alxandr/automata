import { createSelector } from 'reselect';
import memoize from 'lodash.memoize';
import matchPath from 'react-router/matchPath';
import { forWindow } from '../utils';

const lazy = (fn) => {
  const thunk = fn;
  let get = () => {
    const value = thunk();
    get = () => value;
    return value;
  };
  return () => get();
};

export const getRouter = lazy(() => forWindow(require('../store').rendererId, state => state.router));

export const getLocation = lazy(() => createSelector(
  getRouter(),
  ({ index, entries }) => entries[index]
));

export const getMatch = memoize(({ path, exact = false, strict = false }) => createSelector(
  getLocation(),
  (location) =>
    location && location.pathname && matchPath(location.pathname, path, { exact, strict }) || null
));
