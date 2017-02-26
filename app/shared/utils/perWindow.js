import { EXIT, INIT } from '@shared/window/constants';
import remove from './remove';

const defaultInit = () => ({});

export default function perWindow(reducer, init = defaultInit) {
  const reducerName = reducer.name || 'anonymous';
  const name = `perWindow(${reducerName})`;
  const fn = (state = {}, action) => {
    if (action.type === INIT) {
      return {
        ...state,
        [action.payload.id]: init(action)
      };
    }

    if (action.type === EXIT) {
      return remove(state, action.payload);
    }

    if (action && action.meta && action.meta.window) {
      const window = action.meta.window;
      const oldState = state[window];
      const newState = reducer(oldState, action);
      if (newState !== oldState) {
        return { ...state, [window]: newState };
      }
    }

    return state;
  };

  Object.defineProperty(fn, 'name', { value: name });
  return fn;
}
