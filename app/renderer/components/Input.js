import React, { PropTypes } from 'react';
import { createStyleSheet } from 'jss-theme-reactor';
import { defaultProps, setDisplayName } from 'recompose';
import classNames from 'classnames';
import { Field } from 'redux-form';
import Button from './Button';
import Icon from './Icon';
import { withStyleSheet } from '../styles/styled';
import { composeComponent } from '../utils';

const styleSheet = createStyleSheet('Input', ({
  inputRestState,
  inputFocusState
}) => ({
  control: {
    display: 'inline-block',
    minHeight: '2.125rem',
    height: '2.125rem',
    position: 'relative',
    verticalAlign: 'middle',
    margin: '.325rem 0',
    lineHeight: '1',

    '&$text': {
      width: '10.875rem',

      '&$fullSize': {
        width: '100%'
      }
    },

    '& $helperButton': {
      margin: '2px 2px 0',
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 2,
      //visibility: 'hidden',
      border: 0,
      height: '1.875rem',
      padding: '0 .6rem',
      fontSize: '.75rem'
    }
  },

  text: {},
  fullSize: {},

  label: {
    position: 'absolute',
    left: 0,
    top: '-1rem',
    fontSize: '.875rem'
  },

  input: {
    appearance: 'none',
    position: 'relative',
    border: `1px ${inputRestState} solid`,
    width: '100%',
    height: '100%',
    padding: '.3125rem',
    zIndex: 0,

    '&:focus, &:hover': {
      outline: 'none',
      borderColor: inputFocusState
    }
  },
  helperButton: {}
}));

const Input =
  composeComponent(
    setDisplayName('Input'),
    withStyleSheet(styleSheet),
    defaultProps({ type: 'text' }),
    ({ classes, label, name, type, fullSize, className: inputClass }) => {
      const className = classNames(inputClass, classes.control, {
        [classes.fullSize]: fullSize,
        [classes.text]: type === 'text' || type === 'password'
      });

      return (
        <div className={className}>
          <label>
            <span className={classes.label}>{label}</span>
            <Field component="input" type={type} name={name} className={classes.input} />
          </label>
          <Button className={classes.helperButton} tabIndex="-1">
            <Icon type="cross" />
          </Button>
        </div>
      );
    }
  );

Input.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string
};

export default Input;
