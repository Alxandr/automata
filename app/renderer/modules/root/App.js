import { Route, Switch } from 'react-router';

import AppBar from './components/appbar';
import AppContent from './components/appcontent';
import AppFrame from '@components/appframe';
import Instances from './components/instances';
import React from 'react';
import Versions from './components/versions';

const NoMatch = () => (<h1>No match</h1>);

const tabs = [
  { path: '/', exact: true, label: 'Instances' },
  { path: '/versions', label: 'Versions' }
];

const App = () => (
  <AppFrame>
    <AppBar title='Automata' tabs={ tabs } />

    <AppContent>
      <Switch>
        <Route  exact path="/" component={Instances} />
        <Route path="/versions" component={Versions} />
        <Route component={NoMatch} />
      </Switch>
    </AppContent>
  </AppFrame>
);

export default App;
