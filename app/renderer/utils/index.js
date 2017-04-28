import { compose, createEagerFactory } from 'recompose';

import { Component } from 'react';
import classNames from 'classnames';
import createHelper from './createHelper';

export {
  createHelper
};

export { default as reduxSagaForm } from './reduxSagaForm';

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

export const onWillMount = createHelper(fn => BaseComponent => {
  const factory = createEagerFactory(BaseComponent);
  class OnWillMount extends Component {
    componentWillMount() {
      fn(this.props);
    }

    render() {
      return factory(this.props);
    }
  }

  return OnWillMount;
}, 'onWillMount');

export const composeComponent = (...args) => {
  const fns = args.slice(0, args.length - 1);
  const comp = args[args.length - 1];
  return compose(...fns)(comp);
};
