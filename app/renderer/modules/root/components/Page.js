import React,{ PropTypes } from 'react';
import { createStyleSheet } from 'jss-theme-reactor';
import { setDisplayName } from 'recompose';
import { removeInvalid, withClasses, withStyleSheet } from '../../../styles/styled';
import { composeComponent } from '../../../utils';

const styleSheet = createStyleSheet('Page', () => ({
  root: {},

  title: {
    fontStyle: 'normal',
    fontWeight: '300'
  },

  hr: {
    height: '1px',
    backgroundColor: '#eee',
    border: 'none'
  }
}));

const Hr =
  composeComponent(
    setDisplayName('Hr'),
    withStyleSheet(styleSheet),
    withClasses('hr'),
    removeInvalid(),
    'hr'
  );

const Page =
  composeComponent(
    setDisplayName('Page'),
    withStyleSheet(styleSheet),
    ({ classes, name, children }) => (
      <div className={classes.root}>
        <h1 className={classes.title}>{name}</h1>
        <Hr />
        {children}
      </div>
    )
  );

Page.propTypes = {
  name: PropTypes.string.isRequired
};

Page.Hr = Hr;
export default Page;
