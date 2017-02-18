import React from 'react';
import { Provider } from 'react-redux';
import Styletron from 'styletron-client';
import { StyletronProvider } from 'styletron-react';
import { store } from '../../store';
import Router from '../../router/Router';
import MainApp from './components/MainApp';

/*const locale = getCurrentLocale();
addLocaleData(en);

let messages;
try {
  messages = require(`../../../i18n/${locale}`).default;
} catch (e) {
  messages = require('../../../i18n/en-US').default;
}

const localeData = getLocaleData(messages, locale);*/

// TODO: Locale
/*const App = () => (
  <Provider store={store}>
    <IntlProvider locale={localeData.locale} messages={localeData.messages}>
      <Router>
        <MainApp />
      </Router>
    </IntlProvider>
  </Provider>
);*/

const styletron = new Styletron();

const App = () => (
  <StyletronProvider styletron={styletron}>
    <Provider store={store}>
      <Router>
        <MainApp />
      </Router>
    </Provider>
  </StyletronProvider>
);

export default App;
