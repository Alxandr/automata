import { SUBMIT } from './constants';

export const submitFilter = (window, form) => ({ type, meta }) =>
  type === SUBMIT &&
  meta &&
  meta.window === window &&
  meta.form === form;
