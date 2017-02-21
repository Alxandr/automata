import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../store';
import Router from '../../router/Router';
import MainApp from './components/MainApp';
import ThemeProvider from '../../styles/ThemeProvider';

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

const App = () => (
  <ThemeProvider>
    <Provider store={store}>
      <Router>
        <MainApp />
      </Router>
    </Provider>
  </ThemeProvider>
);

export default App;
