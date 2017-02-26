import React from 'react';
import { Route, Switch } from 'react-router';
import { createStyleSheet } from 'jss-theme-reactor';
import { setDisplayName ,withProps } from 'recompose';
import { Column, ColumnLayout } from '@components/layout';
import NavSidebar from './components/NavSidebar';
import Versions from './components/Versions';
import { withClasses, withStyleSheet } from '@styles/styled';
import { composeComponent } from '../../utils';

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

const App = () => (
  <RootLayout>
    <MenuColumn>
      <NavSidebar />
    </MenuColumn>
    <MainColumn>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/versions" component={Versions} />
        <Route component={NoMatch} />
      </Switch>
    </MainColumn>
  </RootLayout>
);

export default App;
