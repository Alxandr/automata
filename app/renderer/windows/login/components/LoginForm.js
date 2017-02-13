import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import LoginForm from 'grommet/components/LoginForm';


const FactorioLoginForm = ({ handleSubmit }) => (
  <LoginForm align="center" title="Factorio Login"
    usernameType="text" onSubmit={handleSubmit} />
);

FactorioLoginForm.propTypes = {
  onSubmit: PropTypes.func
};



export default FactorioLoginForm;
