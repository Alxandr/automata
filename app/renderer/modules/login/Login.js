import { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import { composeComponent, reduxSagaForm } from '@renderer/utils';

import Button from 'material-ui/Button';
import React from 'react';
import { TextField } from '@components/form';
import { cancel } from '@shared/window';
import { connect } from 'react-redux';
import { createStyleSheet } from 'jss-theme-reactor';
import { setDisplayName } from 'recompose';
import { withStyleSheet } from '@styles/styled';

const styleSheet = createStyleSheet('Login', () => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  }
}));

const validate = values => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Required';
  }

  if (!values.password) {
    errors.password = 'Required';
  }

  return errors;
};

const mapDispatchToProps = {
  cancel
};

const LoginWindow = composeComponent(
  setDisplayName('LoginWindow'),
  withStyleSheet(styleSheet),
  connect(null, mapDispatchToProps),
  reduxSagaForm({
    form: 'login',
    validate
  }),
  ({ classes, cancel, handleSubmit, pristine, invalid, submitting }) => (
    <form className={ classes.form } onSubmit={ handleSubmit }>
      <DialogTitle>Factorio login</DialogTitle>
      <DialogContent>
        <TextField label='Username' name='username' />
        <TextField label='Password' name='password' type='password' />
      </DialogContent>
      <DialogActions>
        <Button onClick={ cancel }>Cancel</Button>
        <Button type='submit' primary disabled={ pristine || invalid || submitting }>Login</Button>
      </DialogActions>
    </form>
  )
);

export default LoginWindow;
