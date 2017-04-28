import { compose, defaultProps, setDisplayName } from 'recompose';
import { withClasses, withStyleSheet } from '../styles/styled';

import PropTypes from 'prop-types';
import React from 'react';
import { createStyleSheet } from 'jss-theme-reactor';

const size = 64;
const border = 3;
const offset1 = 5;
const offset2 = 15;

const createSize = (scale) => ({
  width: `${size * scale}px`,
  height: `${size * scale}px`,
  position: 'relative',
  overflow: 'hidden',
  '& $spinner': {
    'display': 'block',
    'position': 'relative',
    'left': '50%',
    'top': '50%',
    'width': `${size * scale}px`,
    'height': `${size * scale}px`,
    'margin': `-${(size * scale)/2}px 0 0 -${(size * scale)/2}px`,
    'border-radius': '50%',
    'border-width': `${border * scale}px`,
    'border-style': 'solid',
    'border-left-color': 'transparent',
    'border-right-color': 'transparent',
    'border-bottom-color': 'transparent',
    'border-top-color': '#3498db',
    'animation': 'ani-pre-spin 1s linear infinite',
    'z-index': '1001',
    '&::before': {
      'content': '""',
      'position': 'absolute',
      'top': `${offset1 * scale}px`,
      'left': `${offset1 * scale}px`,
      'right': `${offset1 * scale}px`,
      'bottom': `${offset1 * scale}px`,
      'border-radius': '50%',
      'border-width': `${border * scale}px`,
      'border-style': 'solid',
      'border-left-color': 'transparent',
      'border-right-color': 'transparent',
      'border-bottom-color': 'transparent',
      'border-top-color': '#e74c3c',
      'animation': 'ani-pre-spin 2s linear infinite'
    },
    '&::after': {
      'content': '""',
      'position': 'absolute',
      'top': `${offset2 * scale}px`,
      'left': `${offset2 * scale}px`,
      'right': `${offset2 * scale}px`,
      'bottom': `${offset2 * scale}px`,
      'border-radius': '50%',
      'border-width': `${border * scale}px`,
      'border-style': 'solid',
      'border-left-color': 'transparent',
      'border-right-color': 'transparent',
      'border-bottom-color': 'transparent',
      'border-top-color': '#f9c922',
      'animation': 'ani-spin 1.5s linear infinite'
    }
  }
});

const styleSheet = createStyleSheet('Preloader', () => ({
  s1: createSize(1),
  s2: createSize(2),
  s3: createSize(3),
  s4: createSize(4),
  s5: createSize(5),
  lock: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    transition: 'visibility 0s, opacity 0.5s linear'
  },
  hidden: {
    transition: 'visibility 0s linear 0.5s,opacity 0.5s linear',
    visibility: 'hidden',
    opacity: 0
  },
  spinner: {},
  centered: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }
}));

const Preloader =
  compose(
    setDisplayName('Preloader'),
    withStyleSheet(styleSheet),
    defaultProps({ scale: 1 }),
    withClasses(({ scale }) => [ `s${scale}`, 'centered' ])
  )(({ className, classes }) => (
    <div className={className}>
      <div className={classes.spinner} />
    </div>
  ));
Preloader.propTypes = {
  scale: PropTypes.number
};

const ProgressLock =
  compose(
    setDisplayName('ProgressLock'),
    withStyleSheet(styleSheet),
    withClasses(({ locked }) => locked ? ['lock'] : ['lock', 'hidden'])
  )(({ className, ...props }) => (
    <div className={className}>
      <Preloader {...props} />
    </div>
  ));
ProgressLock.propTypes = {
  ...Preloader.propTypes,
  locked: PropTypes.bool.isRequired
};

export default ProgressLock;
