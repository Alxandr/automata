import { createSelector } from 'reselect';

export const perWindow = (reducer) => (state = {}, action) => {
  const window = action && action.meta && action.meta.renderer;
  if (typeof window !== 'undefined') {
    const windowState = state[window];
    const newWindowState = reducer(windowState, action);
    if (newWindowState !== windowState) {
      return { ...state, [window]: newWindowState };
    }
  }

  return state;
};


export const forWindow = (renderId, selector) => {
  return createSelector(
    selector,
    (allWindows) => allWindows[renderId]
  );
};
