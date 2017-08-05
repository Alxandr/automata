import React from 'react';
import { composeComponent } from '@renderer/utils';
import { createStyleSheet } from 'material-ui/styles';
import { setDisplayName } from 'recompose';
import { withStyles } from '@styles/styled';

const styles = createStyleSheet('DialogForm', () => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
}));

const DialogForm = composeComponent(
  withStyles(styles),
  setDisplayName('DialogForm'),
  ({ classes, ...props }) => <form className={classes.form} {...props} />,
);

export default DialogForm;
