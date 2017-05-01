import { call, cancel, fork, join, race, take } from 'redux-saga/effects';

import { CANCEL } from '@shared/window/constants';
import runWindow from './runWindow';

const named = (name, fn) => {
  Object.defineProperty(fn, 'name', {
    value: name,
    writable: false
  });
  return fn;
};

const modalFn = fn => named(`modal(${fn.name})`, function* (id) {
  const task = yield fork(fn, id);
  const result = yield race({
    result: join(task),
    cancel: take(({ type, meta }) => type === CANCEL && meta.window === id)
  });

  yield cancel(task);

  if (result.cancel) {
    return ['cancel'];
  }

  return [ 'ok', result.result ];
});

export default function* modal(opts, saga) {
  if (!opts.parent) {
    throw new Error('Modal windows requires parent');
  }

  const modalTask = yield call(runWindow, {
    ...opts,
    modal: true
  }, modalFn(saga));

  return yield join(modalTask);
}
