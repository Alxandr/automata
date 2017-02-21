import { combineReducers } from 'redux';
import { reducer as router } from './renderer/router';
import { reducer as form } from 'redux-form';
import { reducer as versions } from './parts/versions';
import { perWindow } from './renderer/utils';

const windowLock = perWindow((state = false, action) => {
  switch (action.type) {
    case 'LOCK_WINDOW': return true;
    case 'UNLOCK_WINDOW': return false;
    default: return state;
  }
});

export const reducer = combineReducers({
  router,
  windowLock,
  form,
  versions
});
