import { EXIT, INIT, LOCK, UNLOCK } from './constants';
import { remove } from '@shared/utils';

const handlers = {
  [INIT]: (state, { payload: { id, module } }) => ({
    ...state,
    [id]: {
      module,
      locked: false
    }
  }),

  [EXIT]: (state, { payload: id }) => remove(state, id),

  [LOCK]: (state, { payload: id }) => ({
    ...state,
    [id]: {
      ...state[id],
      locked: true
    }
  }),

  [UNLOCK]: (state, { payload: id }) => ({
    ...state,
    [id]: {
      ...state[id],
      locked: false
    }
  })
};

export default function windowReducer(state = {}, action) {
  const handler = handlers[action.type];
  return handler ? handler(state, action) : state;
}
