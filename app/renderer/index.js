import MuiThemeProvider, { MUI_SHEET_ORDER } from 'material-ui/styles/MuiThemeProvider';
import React, { Component } from 'react';
import { blue, pink } from 'material-ui/colors';
import { composeComponent, onMounted } from '@renderer/utils';

import AppFrame from '@components/appframe';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import Router from '@components/Router';
import createMuiTheme from 'material-ui/styles/theme';
import createPalette from 'material-ui/styles/palette';
import { ipcRenderer } from 'electron';
import { setDisplayName } from 'recompose';
import { setId } from './windowid';
import { store } from './store';
import { windowSelector } from '@shared/window';

const windowId = ipcRenderer.sendSync('window-get-id');
setId(windowId);

/*const mapStateToProgressProps = createStructuredSelector({
  locked: lockedSelector
});
const ConnectedProgressLock =
  composeComponent(
    connect(mapStateToProgressProps),
    ProgressLock
  );*/

// TODO: move to state.
let styleManager = null;
const App = composeComponent(
  setDisplayName('RootApp'),
  onMounted(() => ipcRenderer.send(`window-${windowId}-ready`)),
  ({ children, dark }) => {
    const palette = createPalette({
      primary: blue,
      accent: pink,
      type: dark ? 'dark' : 'light',
    });

    const theme = createMuiTheme({ palette });

    if (!styleManager) {
      const themeContext = MuiThemeProvider.createDefaultContext({ theme });
      styleManager = themeContext.styleManager;
    } else {
      styleManager.updateTheme(theme);
    }

    styleManager.setSheetOrder(MUI_SHEET_ORDER);

    return (
      <MuiThemeProvider theme={theme} styleManager={styleManager}>
        <Router>
          <AppFrame>
            { children }
            {/*<ConnectedProgressLock scale={3} />*/}
          </AppFrame>
        </Router>
      </MuiThemeProvider>
    );
  }
);

App.propTypes = {
  children: PropTypes.node.isRequired
};

const moduleName = windowSelector(store.getState());
const loadComponent = (() => {
  const getDefault = moduleExports => moduleExports.default;
  const err = e => {
    const NotFound = () => (
      <div>
        <h1>Module {moduleName} not found!</h1>
        <pre>
          { e ? e.stack : 'Module not configured.' }
        </pre>
      </div>
    );

    return NotFound;
  };

  switch (moduleName) {
    case 'root': return System.import('./modules/root').then(getDefault).catch(err);
    case 'login': return System.import('./modules/login').then(getDefault).catch(err);
    case 'dl_factorio': return System.import('./modules/dl_factorio').then(getDefault).catch(err);
    case 'new_inst': return System.import('./modules/new_inst').then(getDefault).catch(err);
    default: return Promise.resolve(err(null));
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

const Root = ({ children }) => (
  <Provider store={store}>
    <App>
      { children }
    </App>
  </Provider>
);
Root.propTypes = {
  children: PropTypes.node.isRequired
};

const root = document.getElementById('root');
ReactDOM.render(<Root><Window /></Root>, root);
