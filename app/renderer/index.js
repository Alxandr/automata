import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { ipcRenderer } from 'electron';
import { Provider, connect } from 'react-redux';
import { createEagerFactory } from 'recompose';
import { createSelector, createStructuredSelector } from 'reselect';
import { lockedSelector, windowSelector } from '@shared/window';
import ThemeProvider from '@styles/ThemeProvider';
import ProgressLock from '@components/ProgressLock';
import Router from '@components/Router';
import { setId } from './windowid';
import { store } from './store';
import { composeComponent } from './utils';

const windowId = ipcRenderer.sendSync('window-get-id');
setId(windowId);

const LoadWindow = ({ match }) => {
  const Component = require(`./modules${match.path}`).default;
  const factory = createEagerFactory(Component);
  return factory({});
};

LoadWindow.propTypes = {
  match: PropTypes.object.isRequired
};

const mapStateToProgressProps = createStructuredSelector({
  locked: lockedSelector
});
const ConnectedProgressLock =
  composeComponent(
    connect(mapStateToProgressProps),
    ProgressLock
  );

const mapStateToMainComponent = createStructuredSelector({
  Window: createSelector(
    windowSelector,
    (module) => {
      try {
        return require(`./modules/${module}`).default;
      } catch (e) {
        const NotFound = () => (
          <h1>Module {module} not found!</h1>
        );
        return NotFound;
      }
    }
  )
});
// TODO: make scale depend on window size?
const App = composeComponent(
  connect(mapStateToMainComponent, null, null, { pure: true }),
  class App extends Component {
    static propTypes = {
      Window: PropTypes.func.isRequired
    };

    render() {
      const { Window } = this.props;

      return (
        <ThemeProvider>
            <Router>
              <div className="root">
                <Window />
                <ConnectedProgressLock scale={4} />
              </div>
            </Router>
        </ThemeProvider>
      );
    }

    componentDidMount() {
      console.log(`Send: window-${windowId}-ready`);
      ipcRenderer.send(`window-${windowId}-ready`);
    }
  });

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  ReactDOM.render(<Root />, root);
});
