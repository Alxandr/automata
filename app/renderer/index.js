import {
  MuiThemeProvider,
  createStyleSheet,
  withStyles,
} from 'material-ui/styles';
import React, { Component } from 'react';
import { composeComponent, onMounted } from '@renderer/utils';

import AppFrame from '@components/appframe';
import { JssProvider } from 'react-jss';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import Router from '@components/Router';
import createContext from './styles/create-context';
import { ipcRenderer } from 'electron';
import { setDisplayName } from 'recompose';
import { setId } from './windowid';
import { store } from './store';
import { windowSelector } from '@shared/window';

const windowId = ipcRenderer.sendSync('window-get-id');
setId(windowId);

const context = createContext();

// Apply some reset
const styles = createStyleSheet('Root', theme => ({
  '@global': {
    html: {
      background: theme.palette.background.default,
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
    },
    body: {
      margin: 0,
    },
  },
}));

const App = composeComponent(
  setDisplayName('RootApp'),
  onMounted(() => ipcRenderer.send(`window-${windowId}-ready`)),
  ({ children }) => {
    return (
      <JssProvider registry={context.sheetsRegistry} jss={context.jss}>
        <MuiThemeProvider
          theme={context.theme}
          sheetsManager={context.sheetsManager}
        >
          <Router>
            <AppFrame>
              {children}
              {/*<ConnectedProgressLock scale={3} />*/}
            </AppFrame>
          </Router>
        </MuiThemeProvider>
      </JssProvider>
    );
  },
);

App.propTypes = {
  children: PropTypes.node.isRequired,
};

const moduleName = windowSelector(store.getState());
const loadComponent = (() => {
  const getDefault = moduleExports => moduleExports.default;
  const err = e => {
    const NotFound = () =>
      <div>
        <h1>
          Module {moduleName} not found!
        </h1>
        <pre>
          {e ? e.stack : 'Module not configured.'}
        </pre>
      </div>;

    return NotFound;
  };

  switch (moduleName) {
    case 'root':
      return System.import('./modules/root').then(getDefault).catch(err);
    case 'login':
      return System.import('./modules/login').then(getDefault).catch(err);
    case 'dl_factorio':
      return System.import('./modules/dl_factorio').then(getDefault).catch(err);
    case 'new_inst':
      return System.import('./modules/new_inst').then(getDefault).catch(err);
    default:
      return Promise.resolve(err(null));
  }
})();

class Window extends Component {
  constructor() {
    super();

    this.state = { WindowComponent: null };
  }

  componentWillMount() {
    loadComponent.then(WindowComponent => {
      this.setState(state => ({ ...state, WindowComponent }));
    });
  }

  render() {
    const { WindowComponent } = this.state;

    if (!WindowComponent) {
      return null;
    }

    return <WindowComponent />;
  }
}

const StyledWindow = withStyles(styles)(Window);

const Root = ({ children }) =>
  <Provider store={store}>
    <App>
      {children}
    </App>
  </Provider>;
Root.propTypes = {
  children: PropTypes.node.isRequired,
};

const root = document.getElementById('root');
ReactDOM.render(
  <Root>
    <StyledWindow />
  </Root>,
  root,
);
