import { Tab, Tabs } from 'material-ui/Tabs';
import { matchPath, withRouter } from 'react-router';
import { push as routerPush, replace as routerReplace } from '@shared/router';
import { setDisplayName, setPropTypes } from 'recompose';

import AppBar from 'material-ui/AppBar';
import PropTypes from 'prop-types';
import React from 'react';
import Text from 'material-ui/Text';
import Toolbar from 'material-ui/Toolbar';
import { composeComponent } from '@renderer/utils';
import { connect } from 'react-redux';
import { createStyleSheet } from 'jss-theme-reactor';
import { withStyleSheet } from '@styles/styled';

const styleSheet = createStyleSheet('RootAppBar', () => ({
  flex: {
    flex: 1
  },

  tabs: {
    height: '100%',

    '& > div, & > div > div, & > div > div > div:first-child': {
      height: '100%',
    },
  }
}));

const mapDispatchToNavItemProps = (dispatch, { tabs }) => ({
  onTabChange: (_, index) => {
    const tab = tabs[index];
    const replace = Boolean(tab.replace);
    return dispatch(replace ? routerPush(tab.path) : routerReplace(tab.path));
  },

  goHome: () => dispatch(routerPush('/'))
});

const RootAppBar = composeComponent(
  setDisplayName('RootAppBar'),
  setPropTypes({
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.string.isRequired,
        exact: PropTypes.bool,
        label: PropTypes.string.isRequired,
        replace: PropTypes.bool
      }).isRequired
    ).isRequired,
    title: PropTypes.string.isRequired,
  }),
  withStyleSheet(styleSheet),
  connect(null, mapDispatchToNavItemProps),
  withRouter,
  ({ classes, tabs, title, location, onTabChange, goHome }) => {
    let index = 0;
    for (; index < tabs.length; index++) {
      const match = matchPath(location.pathname, tabs[index]);
      if (match) {
        break;
      }
    }

    if (index === tabs.length) {
      index = 0;
    }

    const tabComps = tabs.map(({ label }) => <Tab label={ label } key={ label } />);

    return (
      <AppBar>
        <Toolbar>
          <Text type='title' colorInherit className={ classes.flex } onClick={ goHome }>{ title }</Text>
          <Tabs index={ index } onChange={ onTabChange } className={ classes.tabs }>
            { tabComps }
          </Tabs>
        </Toolbar>
      </AppBar>
    );
  }
);

export default RootAppBar;
