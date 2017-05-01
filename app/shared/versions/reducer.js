import {
  SELECT,
  SELECT_ALL,
  SET_ONLINE_VERSIONS,
  SET_VERSIONS,
  TOGGLE_EXPERIMENTAL,
} from './constants';

const handlers = {
  [SET_VERSIONS]: (state, { payload }) => ({
    ...state,
    local: payload,
    localLoaded: true
  }),

  [SET_ONLINE_VERSIONS]: (state, { payload }) => ({
    ...state,
    online: payload,
    onlineLoaded: true
  }),

  [SELECT]: (state, { payload }) => ({
    ...state,
    local: state.local.map(v => ({
      ...v,
      selected: v.name === payload ? !v.selected : v.selected
    }))
  }),

  [SELECT_ALL]: (state) => {
    const allSelected = state.local.every(v => v.selected);

    return {
      ...state,
      local: state.local.map(v => ({
        ...v,
        selected: !allSelected
      }))
    };
  },

  [TOGGLE_EXPERIMENTAL]: (state) => ({
    ...state,
    showExperimental: !state.showExperimental
  })
};

const initialState = {
  local: [],
  online: [],
  localLoaded: false,
  onlineLoaded: false,
  showExperimental: false
};

export default (state = initialState, action) => {
  const { type } = action;
  const handler = handlers[type];
  if (handler) {
    return handler(state, action);
  }

  return state;
};
