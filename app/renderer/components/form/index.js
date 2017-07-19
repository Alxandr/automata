import { defaultProps, setDisplayName, setPropTypes } from 'recompose';

import { Field } from 'redux-form';
import FormControl from 'material-ui/Form/FormControl';
import { FormControlLabel } from 'material-ui/Form'
import Input from 'material-ui/Input/Input';
import InputLabel from 'material-ui/Input/InputLabel';
import MUICheckbox from 'material-ui/Checkbox';
//import MUISelectField from 'material-ui/SelectField';
import MUISwitch from 'material-ui/Switch';
import MUITextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import React from 'react';
import { composeComponent } from '@renderer/utils';

const ActualSelect = children => ({
  className,
  disabled,
  name,
  onBlur,
  onChange,
  onFocus,
  value
}) => (
  <select
    className={ className }
    disabled={ disabled }
    name={ name }
    onBlur={ onBlur }
    onChange={ onChange }
    onFocus={ onFocus }
    value={ value }>
    {children}
  </select>
);

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
  fullWidth,
  ...other
}) => (
    <FormControl className={ className } error={ error } required={ required } {...other}>
      {label && (
        <InputLabel className={labelClassName}>
          {label}
        </InputLabel>
      )}
      <Input
        component={ ActualSelect(options.map(v => <option value={ v.value } key={ v.name }>{ v.name }</option>)) }
        className={ inputClassName }
        value={ value }
        name={ name }
        disabled={ disabled }
        { ...inputProps } />
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
  ({ input, label, type, fullWidth, meta: { touched, error } }) => (
    <MUITextField label={ label } error={ Boolean(touched && error) } { ...input } type={ type } fullWidth={ fullWidth } />
  )
);

export const TextField = composeComponent(
  setDisplayName('TextField'),
  setPropTypes({
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    fullWidth: PropTypes.bool,
  }),
  ({ type, name, label, fullWidth }) => (
    <Field name={ name } component={ TextFieldComponent } label={ label } type={ type } fullWidth={ fullWidth } />
  )
);

const SelectComponent = composeComponent(
  setDisplayName('SelectComponent'),
  setPropTypes({
    options: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired,
    fullWidth: PropTypes.bool,
  }),
  ({ input, label, options, fullWidth, meta: { touched, error } }) => (
    <MUISelectField label={ label } fullWidth={ fullWidth } error={ Boolean(touched && error) } { ...input } options={ options } />
  )
);

export const Select = composeComponent(
  setDisplayName('Select'),
  setPropTypes({
    options: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    fullWidth: PropTypes.bool,
  }),
  ({ options, name, label, fullWidth }) => (
    <Field name={ name } component={ SelectComponent } label={ label } options={ options } fullWidth={ fullWidth } />
  )
);

const CheckboxComponent = composeComponent(
  setDisplayName('CheckboxComponent'),
  setPropTypes({
    label: PropTypes.string.isRequired
  }),
  ({ input, label }) => (
    <LabelCheckbox label={ label } checked={ input.value ? true : false } onChange={ input.onChange } />
  )
);

export const Checkbox = composeComponent(
  setDisplayName('Checkbox'),
  setPropTypes({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }),
  ({ name, label }) => (
    <Field name={ name } component={ CheckboxComponent } label={ label } />
  )
);

const LabelSwitch = ({ label, ...props }) => <FormControlLabel label={ label } component={ <MUISwitch { ...props } /> } />;

const SwitchComponent = composeComponent(
  setDisplayName('SwitchComponent'),
  setPropTypes({
    label: PropTypes.string,
    className: PropTypes.string
  }),
  ({ input, label, className }) => {
    const Comp = label ? LabelSwitch : MUISwitch;
    const classProp = label ? { classes: { label: className } } : { className };

    return <Comp label={ label } checked={ input.value ? true : false } onChange={ input.onChange } { ...classProp } />;
  }
);

export const Switch = composeComponent(
  setDisplayName('Switch'),
  setPropTypes({
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    className: PropTypes.string
  }),
  ({ name, label, className }) => (
    <Field name={ name } component={ SwitchComponent } label={ label } className={ className } />
  )
);
