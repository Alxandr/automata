import { defaultProps, setDisplayName } from 'recompose';
import { removeInvalid, withClasses, withStyleSheet } from '../styles/styled';

import Color from 'color';
import Icon from './Icon';
import { PropTypes } from 'react';
import { composeComponent } from '../utils';
import { createStyleSheet } from 'jss-theme-reactor';

const styleSheet = createStyleSheet('Button', ({
  defaultBGColor,
  borderColorButton,
  textColor,
  inputHoverState,
  grayLighter,
  linkColor,
  white,
  darkCyan,
  green,
  darkGreen,
  transparent,
  linkVisitedColor
}) => ({
  button: {
    padding: '0 1rem',
    height: '2.125rem',
    textAlign: 'center',
    verticalAlign: 'middle',
    backgroundColor: defaultBGColor,
    border: `1px ${borderColorButton} solid`,
    color: textColor,
    cursor: 'pointer',
    display: 'inline-block',
    outline: 'none',
    fontSize: '.875rem',
    margin: '.15625rem 0',
    position: 'relative',

    '&$default': {
      backgroundColor: '#008287',
      color: '#fff'
    },

    '&:hover': {
      borderColor: Color(inputHoverState).darken(.1).string()
    },

    '&:active': {
      background: grayLighter,
      color: textColor,
      boxShadow: 'none'
    },

    '&:focus': {
      outline: 'none'
    },

    '& *': {
      color: 'inherit',

      '&:hover': {
        color: 'inherit'
      }
    },

    '&$rounded': {
      borderRadius: '.325rem'
    },

    [`& > .${Icon.className}`]: {
      verticalAlign: 'middle'
    },

    '&$shadow': {
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.3)'
    },

    '& img': {
      height: '.875rem',
      verticalAlign: 'middle',
      margin: 0
    },

    '&$primary': {
      background: linkColor,
      color: white,
      borderColor: linkColor,

      '&:active': {
        background: darkCyan,
        color: white
      }
    },

    '&$success': {
      background: green,
      color: white,
      borderColor: green,

      '&:active': {
        background: darkGreen,
        color: white
      }
    },

    '&$link': {
      background: transparent,
      color: linkColor,
      borderColor: transparent,
      textDecoration: 'underline',

      '&:hover, &:active': {
        background: transparent,
        color: Color(linkVisitedColor).darken(.2).string(),
        borderColor: transparent
      }
    },

    '&:disabled, &$disabled': {
      backgroundColor: '#eaeaea',
      color: '#bebebe',
      cursor: 'default',
      borderColor: 'transparent'
    }
  },

  rounded: {},
  default: {},
  shadow: {},
  disabled: {},
  primary: {},
  success: {},
  link: {}
}));

const Button =
  composeComponent(
    setDisplayName('Button'),
    withStyleSheet(styleSheet),
    withClasses(({ primary, success, link, disabled }) => ({ button: true, primary, success, link, disabled })),
    removeInvalid(),
    defaultProps({ type: 'button' }),
    'button'
  );

Button.propTypes = {
  primary: PropTypes.bool
};

export default Button;
