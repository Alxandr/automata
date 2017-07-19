import React from 'react';
import { composeComponent } from '@renderer/utils';
import { createStyleSheet } from 'jss-theme-reactor';
import { setDisplayName } from 'recompose';
import { withStyleSheet } from '@styles/styled';

const styleSheet = createStyleSheet('DialogForm', () => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  }
}));

const DialogForm = composeComponent(
  withStyleSheet(styleSheet),
  setDisplayName('DialogForm'),
  ({ classes, ...props }) => (
    <form className={ classes.form } { ...props }></form>
  )
);

export default DialogForm;
