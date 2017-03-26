import { Provider, connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { lockedSelector, windowSelector } from '@shared/window';

import ProgressLock from '@components/ProgressLock';
import ReactDOM from 'react-dom';
import Router from '@components/Router';
import ThemeProvider from '@styles/ThemeProvider';
import { composeComponent } from './utils';
import { createStructuredSelector } from 'reselect';
import { ipcRenderer } from 'electron';
import { setId } from './windowid';
import { store } from './store';

const windowId = ipcRenderer.sendSync('window-get-id');
setId(windowId);

const mapStateToProgressProps = createStructuredSelector({
  locked: lockedSelector
});
const ConnectedProgressLock =
  composeComponent(
    connect(mapStateToProgressProps),
    ProgressLock
  );

// TODO: make scale depend on window size?
class App extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    const { children } = this.props;

    return (
      <ThemeProvider>
          <Router>
            <div className="root">
              { children }
              <ConnectedProgressLock scale={3} />
            </div>
          </Router>
      </ThemeProvider>
    );
  }

  componentDidMount() {
    ipcRenderer.send(`window-${windowId}-ready`);
  }
}

const moduleName = windowSelector(store.getState());
let Window;
try {
  Window = require(`./modules/${moduleName}/index`).default;
} catch (e) {
  const NotFound = () => (
    <div>
      <h1>Module {moduleName} not found!</h1>
      <pre>
        {e.stack}
      </pre>
    </div>
  );
  Window = NotFound;
}

const Root = ({ children }) => (
  <Provider store={store}>
    <App>
      {children}
    </App>
  </Provider>
);
Root.propTypes = {
  children: PropTypes.node.isRequired
};

const root = document.getElementById('root');
ReactDOM.render(<Root><Window /></Root>, root);
