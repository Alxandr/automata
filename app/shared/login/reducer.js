import { SET_LOGIN } from './constants';

const handlers = {
  [SET_LOGIN]: (state, { payload }) => ({
    ...state,
    cookies: payload
  })
};

const initialState = {
  cookies: null
};

export default function loginReducer(state = initialState, action) {
  const handler = handlers[action.type];
  return handler ? handler(state, action) : state;
}
