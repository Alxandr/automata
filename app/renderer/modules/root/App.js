import { Route, Switch } from 'react-router';

import AppBar from './components/appbar';
import AppContent from './components/appcontent';
import AppFrame from '@components/appframe';
import Instance from './components/instance';
import Instances from './components/instances';
import PageInfo from './components/pageinfo';
import React from 'react';
import Versions from './components/versions';

const NoMatch = () => (<h1>No match</h1>);

const tabs = [
  { path: '/', exact: true, label: 'Instances', reset: true },
  { path: '/versions', label: 'Versions', reset: true }
];

const App = () => (
  <AppFrame>
    <PageInfo title='Automata'>{({ title }) =>
      <AppBar title={ title } tabs={ tabs } />
    }</PageInfo>

    <AppContent>
      <Switch>
        <Route  exact path='/' component={ Instances } />
        <Route path='/versions' component={ Versions } />
        <Route path='/instances/:slug' component={ Instance } />
        <Route component={NoMatch} />
      </Switch>
    </AppContent>
  </AppFrame>
);

export default App;
