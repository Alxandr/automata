import { composeComponent, reduxSagaForm } from '@renderer/utils';
import { createSelector, createStructuredSelector } from 'reselect';

import Button from 'material-ui/Button';
import React from 'react';
import { Select } from '@components/form';
import Text from 'material-ui/Text';
import Toolbar from 'material-ui/Toolbar';
import { cancel } from '@shared/window';
import { connect } from 'react-redux';
import { createStyleSheet } from 'jss-theme-reactor';
import { onlineVersionsSelector } from '@shared/versions';
import { setDisplayName } from 'recompose';
import { withStyleSheet } from '@styles/styled';

const styleSheet = createStyleSheet('DlFactorio', () => ({
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

const versionsSelector = createSelector(
  onlineVersionsSelector,
  versions => versions
    .filter(({ installed }) => !installed)
    .map(({ name }) => ({ name, value: name }))
);
const mapStateToProps = createStructuredSelector({
  versions: versionsSelector,

  initialValues: createStructuredSelector({
    version: createSelector(
      versionsSelector,
      versions => versions[0] && versions[0].name
    )
  })
});

const mapDispatchToProps = {
  cancel
};

const Window = composeComponent(
  setDisplayName('DlFactorio'),
  withStyleSheet(styleSheet),
  connect(mapStateToProps, mapDispatchToProps),
  reduxSagaForm({
    form: 'download'
  }),
  ({ versions, handleSubmit, classes, cancel, invalid, submitting }) => (
    <div className={ classes.root }>
      <form className={ classes.form } onSubmit={ handleSubmit }>
        <Text type='title'>Download version</Text>
        <br />
        <Select label="Version" name="version" options={ versions } />
        <Toolbar className={ classes.toolbar }>
          <Button raised primary type='submit' className={ classes.button } disabled={ invalid || submitting }>Download</Button>
          <Button className={ classes.button } onClick={ cancel }>Cancel</Button>
        </Toolbar>
      </form>
    </div>
  )
);

export default Window;
