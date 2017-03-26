import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { reducer as login } from './login';
import perWindow from './utils/perWindow';
import { reducer as router } from './router';
import { reducer as versions } from './versions';
import { reducer as window } from './window';

const form = perWindow(formReducer);

export const reducer = combineReducers({
  router,
  window,
  form,
  versions,
  login
});
