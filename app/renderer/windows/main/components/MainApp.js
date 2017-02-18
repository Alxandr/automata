import React from 'react';
import { Route, Switch } from 'react-router';
import { styled } from 'styletron-react';
import NavSidebar from './NavSidebar';
import Versions from './Versions';
import { ColumnLayout, Column } from '../../common/components/layout';

const RootLayout = styled(ColumnLayout, {
  height: '100%'
});

const Home = () => (<h1>Home</h1>);
const NoMatch = () => (<h1>No match</h1>);

const MainApp = () => (
  <RootLayout>
    <Column fixed width="200px">
      <NavSidebar />
    </Column>
    <Column flex>
      <Switch>
        <Route path="/index" component={Home} />
        <Route path="/versions" component={Versions} />
        <Route component={NoMatch} />
      </Switch>
    </Column>
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
