import {
  SET_INSTANCES,
} from './constants';

const handlers = {
  [SET_INSTANCES]: (state, { payload }) => ({ ...state, instances: payload, loaded: true })
};

const initialState = {
  instances: [],
  loaded: false
};

export default (state = initialState, action) => {
  const { type } = action;
  const handler = handlers[type];
  if (handler) {
    return handler(state, action);
  }

  return state;
};
