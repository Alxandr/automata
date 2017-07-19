import { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import { composeComponent, reduxSagaForm } from '@renderer/utils';

import Button from 'material-ui/Button';
import DialogForm from '@components/form/DialogForm';
import Grid from 'material-ui/Grid';
import React from 'react';
import { TextField } from '@components/form';
import { cancel } from '@shared/window';
import { connect } from 'react-redux';
import { setDisplayName } from 'recompose';

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
  connect(null, mapDispatchToProps),
  reduxSagaForm({
    form: 'login',
    validate
  }),
  setDisplayName('LoginWindow'),
  ({ cancel, handleSubmit, pristine, invalid, submitting }) => (
    <DialogForm onSubmit={ handleSubmit }>
      <DialogTitle>Factorio login</DialogTitle>
      <DialogContent>
        <TextField label='Username' name='username' fullWidth />
        <TextField label='Password' name='password' type='password' fullWidth />
      </DialogContent>
      <DialogActions>
        <Button onClick={ cancel }>Cancel</Button>
        <Button type='submit' primary disabled={ pristine || invalid || submitting }>Login</Button>
      </DialogActions>
    </DialogForm>
  ),
);

export default LoginWindow;
