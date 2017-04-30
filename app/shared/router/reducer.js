import { GO, PUSH, REPLACE, RESET } from './consts';

import { createLocation } from 'history/LocationUtils';
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
  },

  [PUSH]: (state, { payload }) => {
    const location = createLocation(payload, payload.state, payload.key, state.entries[state.index]);
    return Object.freeze({
      ...state,
      action: 'PUSH',
      entries: Object.freeze([ ...state.entries, location ]),
      index: state.index + 1
    });
  },

  [RESET]: (state, { payload }) => {
    const location = createLocation(payload, payload.state, payload.key, state.entries[state.index]);
    return Object.freeze({
      ...state,
      action: 'PUSH',
      entries: [
        location
      ],
      index: 0
    });
  },

  [GO]: (state, { payload }) => {
    const index = Math.max(0, Math.min(state.entries.length - 1, state.index + payload));
    return Object.freeze({
      ...state,
      index
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
