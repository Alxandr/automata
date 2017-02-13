import React from 'react';
import App from 'grommet/components/App';
import Split from 'grommet/components/Split';
import Title from 'grommet/components/Title';
import { Route, Switch } from 'react-router';
import NavSidebar from './NavSidebar';
import Versions from './Versions';

const Home = () => (<Title>Home</Title>);
const NoMatch = () => (<Title>No match</Title>);

const MainApp = () => (
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
);

export default MainApp;
