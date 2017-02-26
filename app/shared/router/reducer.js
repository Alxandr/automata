import { createLocation } from 'history/LocationUtils';
import { REPLACE } from './consts';
import { perWindow } from '../utils';

const arrayAssign = (arr, ...updates) => Object.freeze(Object.assign(arr.concat(), ...updates));

const handlers = {
  [REPLACE]: (state, { payload }) => {
    const location = createLocation(payload, payload.state, payload.key, state.entries[state.index]);
    return Object.freeze({
      ...state,
      action: 'REPLACE',
      entries: arrayAssign(state.entries, {
        [state.index]: location
      })
    });
  }
};

const windowReducer = (state = {}, action) => {
  const handler = handlers[action.type];
  if (handler) {
    return handler(state, action);
  }

  return state;
};

const init = ({ path }) => ({
  entries: [
    createLocation(path, undefined, undefined)
  ],
  action: 'PUSH',
  index: 0
});

export default perWindow(windowReducer, init);
