import React, { Component, PropTypes } from 'react';
import { createPath } from 'history/PathUtils';
import { Router } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { go, goBack, goForward, push, replace } from '@shared/router';
import { forWindow } from '@shared/utils';

const canGo = (index, length) => n => {
  const nextIndex = index + n;
  return nextIndex >= 0 && nextIndex < length;
};

const mapStateToProps = createSelector(
  forWindow(state => state.router),
  ({ entries, action, index }) => ({
    length: entries.length,
    action,
    location: entries[index],
    index,
    entries
  })
);

const mapDispatchToProps = (dispatch) => bindActionCreators({
  push,
  replace,
  go,
  goBack,
  goForward
}, dispatch);

class ReduxRouter extends Component {
  constructor(props, context) {
    super(props, context);
    let listeners = [];
    const listen = (fn) => {
      let isActive = true;

      const listener = (...args) => {
        if (isActive) {
          fn(...args);
        }
      };

      listeners.push(listener);

      return () => {
        isActive = false;
        listeners = listeners.filter(item => item !== listener);
      };
    };

    const forward = (fn) => ({ get: fn, enumerable: true, configurable: false });

    this.history = Object.create({}, {
      length: forward(() => this.props.length),
      action: forward(() => this.props.action),
      location: forward(() => this.props.location),
      index: forward(() => this.props.index),
      entries: forward(() => this.props.entries),
      push: forward(() => this.props.push),
      replace: forward(() => this.props.replace),
      go: forward(() => this.props.go),
      goBack: forward(() => this.props.goBack),
      goForward: forward(() => this.props.goForward),
      createHref: forward(() => createPath),
      canGo: forward(() => canGo(this.props.index, this.props.length)),
      listen: forward(() => listen)
    });

    this._notify = () => {
      listeners.forEach(listener => listener(this.props.location, this.props.action));
    };
  }

  render() {
    const { children } = this.props;

    return (
      <Router history={this.history} children={children} />
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.action !== this.props.action || prevProps.location !== this.props.location) {
      this._notify();
    }
  }
}

ReduxRouter.propTypes = {
  length: PropTypes.number.isRequired,
  action: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  entries: PropTypes.array.isRequired,
  push: PropTypes.func.isRequired,
  replace: PropTypes.func.isRequired,
  go: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired
};

const ConnectedRouter = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxRouter);

const historySelector = createStructuredSelector({
  history: forWindow(state => state.router)
});
export default connect(historySelector)(({ history, children }) => {
  if (history) {
    return <ConnectedRouter children={children} />;
  } else {
    return null;
  }
});
