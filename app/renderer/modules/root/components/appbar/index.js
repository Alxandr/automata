import { Tab, Tabs } from 'material-ui/Tabs';
import { goBack, reset as routerReset } from '@shared/router';
import { matchPath, withRouter } from 'react-router';
import { setDisplayName, setPropTypes } from 'recompose';

import AppBar from 'material-ui/AppBar';
import ArrowBack from 'material-ui-icons/ArrowBack';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import Text from 'material-ui/Typography';
import Toolbar from 'material-ui/Toolbar';
import classNames from 'classnames';
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

    '& > div': {
      height: '100%',

      '& > div': {
        height: '100%',

        '& > div:first-child': {
          height: '100%',
          alignItems: 'center',
        },
      },
    },
  },

  backButton: {
    transition: 'width .5s, margin-left .5s',
    marginLeft: -12
  },
  backButtonHidden: {
    width: 0,
    marginLeft: 0
  }
}));

const mapDispatchToNavItemProps = (dispatch, { tabs }) => ({
  onTabChange: (_, index) => {
    const tab = tabs[index];
    return dispatch(routerReset(tab.path));
  },

  goBack: () => dispatch(goBack())
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
  ({ classes, tabs, title, location, history, onTabChange, goBack }) => {
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
          <IconButton contrast
            className={ classNames(classes.backButton, { [classes.backButtonHidden]: history.index === 0 }) }
            onClick={ goBack }>
            <ArrowBack />
          </IconButton>
          <Text type='title' colorInherit className={ classes.flex }>{ title }</Text>
          <Tabs index={ index } onChange={ onTabChange } className={ classes.tabs }>
            { tabComps }
          </Tabs>
        </Toolbar>
      </AppBar>
    );
  }
);

export default RootAppBar;
