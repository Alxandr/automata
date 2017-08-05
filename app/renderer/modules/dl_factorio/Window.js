import { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import { composeComponent, reduxSagaForm } from '@renderer/utils';
import { createSelector, createStructuredSelector } from 'reselect';
import {
  onlineVersionsSelector,
  showExperimentalSelector,
  toggleExperimental,
} from '@shared/versions';

import Button from 'material-ui/Button';
import DialogForm from '@components/form/DialogForm';
import { FormControlLabel } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import React from 'react';
import { Select } from '@components/form';
import Switch from 'material-ui/Switch';
import { cancel } from '@shared/window';
import { connect } from 'react-redux';
import { createStyleSheet } from 'material-ui/styles';
import { setDisplayName } from 'recompose';
import { withStyles } from '@styles/styled';

const styles = createStyleSheet('DlFactorioWindow', theme => ({
  experimentalSwitch: {
    position: 'absolute',
    top: theme.spacing.unit,
    right: theme.spacing.unit,
  },
}));

const versionsSelector = createSelector(onlineVersionsSelector, versions =>
  versions
    .filter(({ installed }) => !installed)
    .map(({ name, experimental }) => ({ name, value: name, experimental })),
);

const mapStateToProps = createStructuredSelector({
  versions: versionsSelector,
  showExperimental: showExperimentalSelector,

  initialValues: createStructuredSelector({
    version: createSelector(
      versionsSelector,
      versions => versions[0] && versions[0].name,
    ),
  }),
});

const mapDispatchToProps = {
  cancel,
  toggleExperimental,
};

const Window = composeComponent(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  reduxSagaForm({
    form: 'download',
  }),
  setDisplayName('DlFactorioWindow'),
  ({
    versions,
    showExperimental,
    handleSubmit,
    classes,
    cancel,
    toggleExperimental,
    invalid,
    submitting,
  }) =>
    <DialogForm onSubmit={handleSubmit}>
      <DialogTitle>Download version</DialogTitle>
      <DialogContent>
        <FormControlLabel
          label="Show experimental"
          className={classes.experimentalSwitch}
          control={
            <Switch checked={showExperimental} onChange={toggleExperimental} />
          }
        />
        <Grid container gutter={0}>
          <Grid item xs={12}>
            <Select
              label="Version"
              name="version"
              options={versions}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancel}>Cancel</Button>
        <Button type="submit" color="primary" disabled={invalid || submitting}>
          Download
        </Button>
      </DialogActions>
    </DialogForm>,
);

export default Window;
