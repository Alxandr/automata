import getWindowId from '@windowid';

export default function forWindow(selector) {
  return state => selector(state)[getWindowId()];
}
