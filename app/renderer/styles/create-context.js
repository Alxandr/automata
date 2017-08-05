import { green, purple } from 'material-ui/colors';

import { SheetsRegistry } from 'react-jss';
import { create } from 'jss';
import createGenerateClassName from 'material-ui/styles/createGenerateClassName';
import createMuiTheme from 'material-ui/styles/theme';
import createPalette from 'material-ui/styles/palette';
import preset from 'jss-preset-default';

const theme = createMuiTheme({
  palette: createPalette({
    primary: purple,
    accent: green,
  }),
});

// Configure JSS
const jss = create(preset());
jss.options.createGenerateClassName = createGenerateClassName;

export default function createContext() {
  return {
    jss,
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new WeakMap(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
  };
}
