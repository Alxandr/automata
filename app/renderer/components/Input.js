import { defaultProps, setDisplayName, withProps } from 'recompose';

import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { composeComponent } from '../utils';
import { createStyleSheet } from 'jss-theme-reactor';
import { withStyleSheet } from '../styles/styled';

const styleSheet = createStyleSheet('Input', ({
  inputRestState,
  inputFocusState,
  green,
  red
}) => ({
  control: {
    display: 'inline-block',
    minHeight: '2.125rem',
    height: '2.125rem',
    position: 'relative',
    verticalAlign: 'middle',
    margin: '.325rem 0',
    lineHeight: '1',
    width: '10.875rem',

    '&$fullSize': {
      width: '100%'
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
    },

    '&$success $input': {
      border: `1px solid ${green}`
    },

    '&$error $input': {
      border: `1px solid ${red}`
    }
  },

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
  helperButton: {},
  success: {},
  error: {}
}));

const FieldComponent =
  composeComponent(
    setDisplayName('FieldComponent'),
    withStyleSheet(styleSheet),
    ({ classes, fullSize, className: inputClass, input, label, meta: { touched, error }, inputComponent: InputComponent, ...rest }) => {
      const className = classNames(inputClass, classes.control, {
        [classes.fullSize]: fullSize,
        [classes.success]: touched && !error,
        [classes.error]: touched && error
      });

      return (
        <div className={className}>
          <label>
            <span className={classes.label}>{label}</span>
            <InputComponent className={classes.input} {...rest} {...input} />
          </label>
        </div>
      );
    }
  );

const Input =
  composeComponent(
    setDisplayName('Input'),
    withProps({ component: FieldComponent }),
    defaultProps({ inputComponent: defaultProps({ type: 'text' })('input') }),
    Field
  );

// TODO: This does not work (looks really wrong, and sets value instead of checked).
const Checkbox =
  composeComponent(
    setDisplayName('Input.Checkbox'),
    defaultProps({ inputComponent: defaultProps({ type: 'checkbox' })('input') }),
    Input
  );

Input.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  inputComponent: PropTypes.func
};

Input.Checkbox = Checkbox;

export default Input;
