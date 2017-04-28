import { composeComponent, reduxSagaForm } from '../utils';

import Button from './Button';
import Input from './Input';
import PropTypes from 'prop-types';
import React from 'react';
import { cancel } from '@shared/window';
import { connect } from 'react-redux';
import { createStyleSheet } from 'jss-theme-reactor';
import { setDisplayName } from 'recompose';
import { withStyleSheet } from '../styles/styled';

const styleSheet = createStyleSheet('Login', ({
  white
}) => ({
  login: {
    width: '25rem',
    height: '18.75rem',
    backgroundColor: white,
    padding: '1.25rem'
  },

  title: {
    fontWeight: '300',
    fontStyle: 'normal'
  },

  thin: {
    height: '1px'
  },

  formActions: {}
}));

const mapDispatchToProps = {
  cancel
};

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

const Login =
  composeComponent(
    setDisplayName('Login'),
    withStyleSheet(styleSheet),
    connect(null, mapDispatchToProps),
    reduxSagaForm({
      form: 'login',
      validate
    }),
    ({ classes, cancel, handleSubmit, pristine, invalid, submitting }) => (
      <div className={classes.login}>
        <form onSubmit={handleSubmit}>
          <h1 className={classes.title}>Login to Factorio</h1>
          <hr className={classes.thin} />
          <br />
          <Input name="username" label="Username:" fullSize />
          <br />
          <br />
          <Input name="password" label="Password:" type="password" fullSize />
          <br />
          <br />
          <div className={classes.formActions}>
            <Button type="submit" primary disabled={ pristine || invalid || submitting }>Login</Button>
            <Button link onClick={cancel}>Cancel</Button>
          </div>
        </form>
      </div>
    )
  );

Login.propTypes = {
  onLogin: PropTypes.func.isRequired
};

export default Login;
