import React from 'react';
import { Route, Switch } from 'react-router';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { createStyleSheet } from 'jss-theme-reactor';
import { setDisplayName ,withProps } from 'recompose';
import NavSidebar from './NavSidebar';
import Versions from './Versions';
import { withClasses, withStyleSheet } from '../../../styles/styled';
import { composeComponent, forWindow } from '../../../utils';
import { Column, ColumnLayout } from '../../../components/layout';
import { ProgressLock } from '../../../components/Preloader';

const styleSheet = createStyleSheet('App', () => ({
  app: {
    height: '100%'
  },

  menu: {
    width: '200px'
  },

  main: {
    padding: '20px'
  }
}));

const RootLayout =
  composeComponent(
    setDisplayName('RootLayout'),
    withStyleSheet(styleSheet),
    withClasses('app'),
    ColumnLayout
  );

const MenuColumn =
  composeComponent(
    setDisplayName('MenuColumn'),
    withStyleSheet(styleSheet),
    withClasses('menu'),
    withProps({ fixed: true }),
    Column
  );

const MainColumn =
  composeComponent(
    setDisplayName('MainColumn'),
    withStyleSheet(styleSheet),
    withClasses('main'),
    Column
  );

const Home = () => (<h1>Home</h1>);
const NoMatch = () => (<h1>No match</h1>);

const lockSelector = forWindow(state => state.windowLock);
const mapStateToProgressProps = createSelector(
  lockSelector,
  (locked) => ({ locked: locked })
);
const ConnectedProgressLock =
  composeComponent(
    connect(mapStateToProgressProps),
    ProgressLock
  );

const MainApp = () => (
  <RootLayout>
    <MenuColumn>
      <NavSidebar />
    </MenuColumn>
    <MainColumn>
      <Switch>
        <Route path="/index" component={Home} />
        <Route path="/versions" component={Versions} />
        <Route component={NoMatch} />
      </Switch>
    </MainColumn>
    <ConnectedProgressLock scale={4} />
  </RootLayout>
);

/*const MainApp = () => (
  <App centered={false}>
    <Split fixed={true} flex="right" showOnResponsive="both">
      <NavSidebar />
      <Switch>
        <Route path="/index" component={Home} />
        <Route path="/versions" component={Versions} />
        <Route component={NoMatch} />
      </Switch>
    </Split>
  </App>
);*/

export default MainApp;
