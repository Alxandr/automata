import React from 'react';
import { composeComponent } from '@renderer/utils';
import { setDisplayName } from 'recompose';
import { withStyles } from '@styles/styled';

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
};

const DialogForm = composeComponent(
  withStyles(styles),
  setDisplayName('DialogForm'),
  ({ classes, ...props }) => <form className={classes.form} {...props} />,
);

export default DialogForm;
