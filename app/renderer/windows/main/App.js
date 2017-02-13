import React from 'react';
import { Provider } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import { getCurrentLocale, getLocaleData } from 'grommet/utils/Locale';
import { store } from '../../store';
import Router from '../../router/Router';
import MainApp from './components/MainApp';

const locale = getCurrentLocale();
addLocaleData(en);

let messages;
try {
  messages = require(`../../../i18n/${locale}`).default;
} catch (e) {
  messages = require('../../../i18n/en-US').default;
}

const localeData = getLocaleData(messages, locale);

const App = () => (
  <Provider store={store}>
    <IntlProvider locale={localeData.locale} messages={localeData.messages}>
      <Router>
        <MainApp />
      </Router>
    </IntlProvider>
  </Provider>
);

export default App;
