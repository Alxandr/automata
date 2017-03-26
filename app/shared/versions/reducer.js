import {
  SET_ONLINE_VERSIONS,
  SET_VERSIONS,
} from './constants';

const handlers = {
  [SET_VERSIONS]: (state, { payload }) => ({
    ...state,
    local: payload
  }),

  [SET_ONLINE_VERSIONS]: (state, { payload }) => ({
    ...state,
    online: payload
  })
};

const initialState = {
  local: [],
  online: []
};

export default (state = initialState, action) => {
  const { type } = action;
  const handler = handlers[type];
  if (handler) {
    return handler(state, action);
  }

  return state;
};
