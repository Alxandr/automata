import createHelperInner from 'recompose/createHelper';

export default function createHelper(fn, name) {
  Object.defineProperty(fn, 'name', { value: name });
  return createHelperInner(fn, name);
}
