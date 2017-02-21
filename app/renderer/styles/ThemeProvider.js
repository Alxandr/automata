import { Component, PropTypes, Children } from 'react';
import { create } from 'jss';
import { createStyleManager } from 'jss-theme-reactor/styleManager';
import jssPreset from 'jss-preset-default';

class ThemeProvider extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    styleManager: PropTypes.object,
    theme: PropTypes.object
  }

  static childContextTypes = {
    styleManager: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
  }

  static createDefaultContext({ theme = require('./themes/default').default, styleManager = null } = {}) {
    if (!styleManager) {
      styleManager = createStyleManager({
        theme,
        jss: create(jssPreset())
      });
    }

    if (!styleManager.sheetOrder) {
      // TODO: Set sheet order
    }

    return { theme, styleManager };
  }

  theme = null;
  styleManager = null;
  getChildContext() {
    const { theme, styleManager } = this;
    return { theme, styleManager };
  }

  componentWillMount() {
    const { theme, styleManager } = ThemeProvider.createDefaultContext(this.props);
    this.theme = theme;
    this.styleManager = styleManager;
  }

  componentWillUpdate(nextProps) {
    if (this.styleManager !== nextProps.styleManager) {
      const { theme, styleManager } = ThemeProvider.createDefaultContext(nextProps);
      this.theme = theme;
      this.styleManager = styleManager;
    } else if (this.theme && nextProps.theme && nextProps.theme !== this.theme) {
      this.theme = nextProps.theme;
      this.styleManager.updateTheme(this.theme);
    }
  }

  render() {
    return Children.only(this.props.children);
  }
}

export default ThemeProvider;
