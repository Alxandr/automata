import React from 'react';
import { setDisplayName } from 'recompose';
import Login from '@components/Login';
import { composeComponent } from '../../utils';

const LoginWindow = composeComponent(
  setDisplayName('LoginWindow'),
  () => <Login onLogin={() => {}} />
);

export default LoginWindow;
