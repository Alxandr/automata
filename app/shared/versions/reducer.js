import {
  SET_VERSIONS
} from './constants';

const handlers = {
  [SET_VERSIONS]: (state, { payload }) => ({
    ...state,
    local: payload
  })
};

const initialState = {
  local: []
};

export default (state = initialState, action) => {
  const { type } = action;
  const handler = handlers[type];
  if (handler) {
    return handler(state, action);
  }

  return state;
};
