import { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import { composeComponent, reduxSagaForm } from '@renderer/utils';
import { createSelector, createStructuredSelector } from 'reselect';
import { onlineVersionsSelector, showExperimentalSelector, toggleExperimental } from '@shared/versions';

import Button from 'material-ui/Button';
import DialogForm from '@components/form/DialogForm';
import { LabelSwitch } from 'material-ui/Switch';
import React from 'react';
import { Select } from '@components/form';
import { cancel } from '@shared/window';
import { connect } from 'react-redux';
import { createStyleSheet } from 'jss-theme-reactor';
import { setDisplayName } from 'recompose';
import { withStyleSheet } from '@styles/styled';

const styleSheet = createStyleSheet('DlFactorio', theme => ({
  experimentalSwitch: {
    position: 'absolute',
    top: theme.spacing.unit,
    right: theme.spacing.unit
  }
}));

const versionsSelector = createSelector(
  onlineVersionsSelector,
  versions => versions
    .filter(({ installed }) => !installed)
    .map(({ name, experimental }) => ({ name, value: name, experimental }))
);

const mapStateToProps = createStructuredSelector({
  versions: versionsSelector,
  showExperimental: showExperimentalSelector,

  initialValues: createStructuredSelector({
    version: createSelector(
      versionsSelector,
      versions => versions[0] && versions[0].name
    )
  })
});

const mapDispatchToProps = {
  cancel,
  toggleExperimental
};

const Window = composeComponent(
  setDisplayName('DlFactorio'),
  withStyleSheet(styleSheet),
  connect(mapStateToProps, mapDispatchToProps),
  reduxSagaForm({
    form: 'download'
  }),
  ({ versions, showExperimental, handleSubmit, classes, cancel, toggleExperimental, invalid, submitting }) => (
    <DialogForm onSubmit={ handleSubmit }>
      <DialogTitle>Download version</DialogTitle>
      <DialogContent>
        <LabelSwitch label='Show experimental'
          checked={ showExperimental }
          labelClassName={ classes.experimentalSwitch }
          onChange={ toggleExperimental } />
        <Select label='Version' name='version' options={ versions } />
      </DialogContent>
      <DialogActions>
        <Button onClick={ cancel }>Cancel</Button>
        <Button type='submit' primary disabled={ invalid || submitting }>Download</Button>
      </DialogActions>
    </DialogForm>
  )
);

export default Window;
