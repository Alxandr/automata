import { Component } from 'react';
import createHelperInner from 'recompose/createHelper';
import { createEagerFactory, compose } from 'recompose';
import { createSelector } from 'reselect';
import classNames from 'classnames';

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

export const createHelper = (fn, name) => {
  Object.defineProperty(fn, 'name', { value: name });
  return createHelperInner(fn, name);
};

const removeObjectProps = (obj, names) =>
  Object.keys(obj)
    .filter(n => names.indexOf(n) === -1)
    .reduce((o, n) => ({ ...o, [n]: obj[n] }), {});

export const addClass = createHelper((...classesToAdd) => BaseComponent => {
  const factory = createEagerFactory(BaseComponent);
  return ({ className = '', ...props }) => {
    className = classNames(className, ...classesToAdd);
    return factory({ ...props, className });
  };
}, 'addClass');

export const removeProps = createHelper((...propNames) => BaseComponent => {
  const factory = createEagerFactory(BaseComponent);
  return ownerProps => factory(removeObjectProps(ownerProps, propNames));
}, 'removeProps');

export const onMounted = createHelper(fn => BaseComponent => {
  const factory = createEagerFactory(BaseComponent);
  class OnMounted extends Component {
    componentDidMount() {
      fn(this.props);
    }

    render() {
      return factory(this.props);
    }
  }

  return OnMounted;
}, 'onMounted');

export const composeComponent = (...args) => {
  const fns = args.slice(0, args.length - 1);
  const comp = args[args.length - 1];
  return compose(...fns)(comp);
};
