import { setDisplayName, setPropTypes } from 'recompose';
import { withClasses, withStyles } from '@styles/styled';

import PropTypes from 'prop-types';
import React from 'react';
import { composeComponent } from '@renderer/utils';
import { createStyleSheet } from 'material-ui/styles';

const styles = createStyleSheet('AppFrame', theme => ({
  '@global': {
    html: {
      boxSizing: 'border-box',
    },

    '*, *:before, *:after': {
      boxSizing: 'inherit',
    },

    body: {
      margin: 0,
      background: theme.palette.background.default,
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.text.primary,
      lineHeight: '1.2',
      overflowX: 'hidden',
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
    },

    a: {
      color: theme.palette.accent.A400,
      textDecoration: 'none',
    },

    'a:hover': {
      textDecoration: 'underline',
    },

    img: {
      maxWidth: '100%',
      height: 'auto',
      width: 'auto',
    },
  },

  appFrame: {
    display: 'flex',
    alignItems: 'stretch',
    minHeight: '100vh',
    width: '100%',
  },
}));

const AppFrame = composeComponent(
  withStyles(styles),
  withClasses('appFrame'),
  setDisplayName('AppFrame'),
  setPropTypes({
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
  }),
  ({ className, children }) =>
    <div className={className}>
      {children}
    </div>,
);

export default AppFrame;
