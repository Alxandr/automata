import { combineReducers } from 'redux';
import { reducer as router } from './renderer/router';
import { reducer as form } from 'redux-form'

export const reducer = combineReducers({
  router,
  form
});
