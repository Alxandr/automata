import { composeComponent, reduxSagaForm } from '@renderer/utils';

import Button from 'material-ui/Button';
import React from 'react';
import Text from 'material-ui/Text';
import { TextField } from '@components/form';
import Toolbar from 'material-ui/Toolbar';
import { cancel } from '@shared/window';
import { connect } from 'react-redux';
import { createStyleSheet } from 'jss-theme-reactor';
import { setDisplayName } from 'recompose';
import { withStyleSheet } from '@styles/styled';

const styleSheet = createStyleSheet('Login', () => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },

  form: {
    width: 400,
    paddingTop: 30,
    paddingBottom: 30
  },

  button: {
  },

  toolbar: {
    padding: 0
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
    <div className={ classes.root }>
      <form className={ classes.form } onSubmit={ handleSubmit }>
        <Text type='title'>Factorio login</Text>
        <br />
        <TextField label='Username' name='username' />
        <TextField label='Password' name='password' type='password' />
        <Toolbar className={ classes.toolbar }>
          <Button raised primary type='submit' className={ classes.button } disabled={ pristine || invalid || submitting }>Login</Button>
          <Button className={ classes.button } onClick={ cancel }>Cancel</Button>
        </Toolbar>
      </form>
    </div>
  )
);

export default LoginWindow;
