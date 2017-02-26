import React, { PropTypes } from 'react';
import { createStyleSheet } from 'jss-theme-reactor';
import { setDisplayName } from 'recompose';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { cancel, formStateSelector } from '@shared/window';
import Input from './Input';
import Button from './Button';
import { withStyleSheet } from '../styles/styled';
import { composeComponent } from '../utils';

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

const Login =
  composeComponent(
    setDisplayName('Login'),
    withStyleSheet(styleSheet),
    connect(null, mapDispatchToProps),
    reduxForm({
      form: 'login',
      getFormState: formStateSelector
    }),
    ({ classes, cancel, handleSubmit }) => (
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
            <Button type="submit" primary>Login</Button>
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
