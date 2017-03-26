import { SET_LOGIN } from './constants';

export const setLogin = (session) => ({
  type: SET_LOGIN,
  payload: session
});
