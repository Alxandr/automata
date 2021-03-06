import { CANCEL, EXIT, INIT, LOCK, SUBMIT, UNLOCK } from './constants';

export const init = (module, path, id) => ({
  type: INIT,
  payload: { module, path, id }
});

export const exit = (id) => ({
  type: EXIT,
  payload: id
});

export const lock = (id) => ({
  type: LOCK,
  payload: id
});

export const unlock = (id) => ({
  type: UNLOCK,
  payload: id
});

export const cancel = () => ({
  type: CANCEL
});

export const submit = (form, data) => ({
  type: SUBMIT,
  payload: data,
  meta: { form }
});
