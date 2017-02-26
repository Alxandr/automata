import createHelperInner from 'recompose/createHelper';

const createHelper = (fn, name) => {
  Object.defineProperty(fn, 'name', { value: name });
  return createHelperInner(fn, name);
};

export default createHelper;
