import { defaultProps, setDisplayName, setPropTypes } from 'recompose';

import { Field } from 'redux-form';
import FormControl from 'material-ui/Form/FormControl';
import Input from 'material-ui/Input/Input';
import InputLabel from 'material-ui/Input/InputLabel';
import MUITextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import React from 'react';
import { composeComponent } from '@renderer/utils';

// TODO: Use from MUI when implemented
const MUISelectField = ({
  className,
  disabled,
  error,
  inputClassName,
  inputProps,
  label,
  labelClassName,
  name,
  required,
  options,
  value,
  ...other
}) => (
    <FormControl className={ className } error={ error } required={ required } {...other}>
      {label && (
        <InputLabel className={labelClassName}>
          {label}
        </InputLabel>
      )}
      <Input component='select' className={ inputClassName } value={ value } name={ name } disabled={ disabled } { ...inputProps }>
        { options.map(v => <option value={ v.value } key={ v.name }>{ v.name }</option>) }
      </Input>
    </FormControl>
  );

const TextFieldComponent = composeComponent(
  setDisplayName('TextFieldComponent'),
  setPropTypes({
    type: PropTypes.string,
    label: PropTypes.string.isRequired
  }),
  defaultProps({
    type: 'text'
  }),
  ({ input, label, type, meta: { touched, error } }) => (
    <MUITextField label={ label } error={ Boolean(touched && error) } { ...input } type={ type } />
  )
);

export const TextField = composeComponent(
  setDisplayName('TextField'),
  setPropTypes({
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }),
  ({ type, name, label }) => (
    <Field name={ name } component={ TextFieldComponent } label={ label } type={ type } />
  )
);

const SelectComponent = composeComponent(
  setDisplayName('SelectComponent'),
  setPropTypes({
    options: PropTypes.array.isRequired
  }),
  ({ input, label, options, meta: { touched, error } }) => (
    <MUISelectField label={ label } error={ Boolean(touched && error) } { ...input } options={ options } />
  )
);

export const Select = composeComponent(
  setDisplayName('Select'),
  setPropTypes({
    options: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }),
  ({ options, name, label }) => (
    <Field name={ name } component={ SelectComponent } label={ label } options={ options } />
  )
);
