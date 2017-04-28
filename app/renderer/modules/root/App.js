import { Route, Switch } from 'react-router';

import AppBar from './components/appbar';
import AppContent from './components/appcontent';
import AppFrame from '@components/appframe';
import React from 'react';
import Versions from './components/versions';

const Home = () => (<h1>Home</h1>);
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
        <Route  exact path="/" component={Home} />
        <Route path="/versions" component={Versions} />
        <Route component={NoMatch} />
      </Switch>
    </AppContent>
  </AppFrame>
);

export default App;
