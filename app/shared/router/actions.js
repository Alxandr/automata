import { GO, INIT, PUSH, REPLACE, RESET } from './consts';

import { createLocation } from 'history/LocationUtils';
import warning from 'warning';
import withWindow from '../utils/withWindow';

const createKey = () =>
  Math.random().toString(36).substr(2, 6);

export const init = (module, path, id) => withWindow(id, {
  type: INIT,
  payload: { module, path }
});

export const push = (path, state) => {
  warning(
    !(typeof path === 'object' && path.state !== undefined && state !== undefined),
    'You should avoid provideing a 2nd state argument to push when the 1st ' +
    'argument is a location-like object that already has state; it is ignored'
  );

  const location = createLocation(path, state, createKey());
  return Object.freeze({
    type: PUSH,
    payload: Object.freeze(location)
  });
};

export const replace = (path, state) => {
  warning(
    !(typeof path === 'object' && path.state !== undefined && state !== undefined),
    'You should avoid provideing a 2nd state argument to replace when the 1st ' +
    'argument is a location-like object that already has state; it is ignored'
  );

  const location = createLocation(path, state, createKey());
  return Object.freeze({
    type: REPLACE,
    payload: Object.freeze(location)
  });
};

export const reset = (path, state) => {
  warning(
    !(typeof path === 'object' && path.state !== undefined && state !== undefined),
    'You should avoid provideing a 2nd state argument to reset when the 1st ' +
    'argument is a location-like object that already has state; it is ignored'
  );

  const location = createLocation(path, state, createKey());
  return Object.freeze({
    type: RESET,
    payload: Object.freeze(location)
  });
};

export const go = (n) =>
  Object.freeze({
    type: GO,
    payload: n
  });

export const goBack = () => go(-1);
export const goForward = () => go(1);
