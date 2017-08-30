import { setDisplayName, setPropTypes } from 'recompose';
import { withClasses, withStyles } from '@styles/styled';

import PropTypes from 'prop-types';
import React from 'react';
import { composeComponent } from '@renderer/utils';

const styles = theme => ({
  content: theme.mixins.gutters({
    paddingTop: 80,
    flex: '1 1 100%',
    maxWidth: '100%',
    margin: '0 auto',
  }),

  [theme.breakpoints.up(948)]: {
    content: {
      maxWidth: 900,
    },
  },
});

const AppContent = composeComponent(
  withStyles(styles),
  withClasses('content'),
  setDisplayName('AppContent'),
  setPropTypes({
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
  }),
  ({ className, children }) => <div className={className}>{children}</div>,
);

export default AppContent;
