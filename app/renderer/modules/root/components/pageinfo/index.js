import { Children, Component, cloneElement } from 'react';

import PropTypes from 'prop-types';
import { shallowEqual } from 'recompose';

let _props = {};
const mountedInstances = [];

const reducePropsToState = propList =>
  propList.reduce((acc, { children: _c, ref: _r, ...props }) => ({ ...acc, ...props }), {});

const emitChange = (sender, nextProps) => {
  const propList = mountedInstances.map(inst => inst === sender ? nextProps : inst.props);
  const state = reducePropsToState(propList);
  _props = Object.freeze(state);
  mountedInstances.forEach(inst => inst.setState(() => _props));
};

class PageInfo extends Component {
  static displayName = 'PageInfo'
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.element.isRequired,
      PropTypes.func.isRequired,
    ]),
  }

  componentWillMount() {
    mountedInstances.push(this);
    emitChange();
  }

  componentWillReceiveProps(nextProps) {
    if (!shallowEqual(nextProps, this.props)) {
      emitChange(this, nextProps);
    }
  }

  // TODO: Shallow equals
  shouldComponentUpdate(_nextProps, nextState) {
    return nextState !== this.state;
  }

  componentWillUnmount() {
    const index = mountedInstances.indexOf(this);
    mountedInstances.splice(index, 1);
    emitChange();
  }

  render() {
    const { children } = this.props;
    if (!children) return null;

    if (typeof children === 'function') {
      return children(this.state);
    }

    const childElement = Children.only(children);
    return cloneElement(childElement, this.state);
  }
}

export default PageInfo;
