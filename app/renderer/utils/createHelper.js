import { setDisplayName, wrapDisplayName } from 'recompose';

export default function createHelper(hocFactory, name) {
  Object.defineProperty(hocFactory, 'name', { value: name });
  if (process.env.NODE_ENV !== 'production') {
    return (...args) => BaseComponent =>
      setDisplayName(wrapDisplayName(BaseComponent, name))(
        hocFactory(...args)(BaseComponent)
      );
  }

  return hocFactory;
}
