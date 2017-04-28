import { setDisplayName, setPropTypes } from 'recompose';
import { withClasses, withStyleSheet } from '@styles/styled';

import PropTypes from 'prop-types';
import React from 'react';
import { composeComponent } from '@renderer/utils';
import { createStyleSheet } from 'jss-theme-reactor';

const styleSheet = createStyleSheet('AppContent', theme => ({
  content: theme.mixins.gutters({
    paddingTop: 80,
    flex: '1 1 100%',
    maxWidth: '100%',
    margin: '0 auto',
  }),

  [theme.breakpoints.up(948)]: {
    content: {
      maxWidth: 900,
    }
  }
}));

const AppContent = composeComponent(
  setDisplayName('AppContent'),
  setPropTypes({
    children: PropTypes.node.isRequired,
    className: PropTypes.string
  }),
  withStyleSheet(styleSheet),
  withClasses('content'),
  ({ className, children }) => <div className={ className } children={ children } />
);

export default AppContent;
