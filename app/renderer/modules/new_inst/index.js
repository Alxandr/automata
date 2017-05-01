import { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import { Select, TextField } from '@components/form';
import { composeComponent, onMounted, reduxSagaForm } from '@renderer/utils';
import { createSelector, createStructuredSelector } from 'reselect';
import { fetchLocalInstances, instancesLoadedSelector, instancesSelector } from '@shared/instances';
import { fetchLocalVersions, highestLocalVersionSelector, localVersionsLoadedSelector, localVersionsSelector } from '@shared/versions';
import { setDisplayName, setPropTypes } from 'recompose';

import Button from 'material-ui/Button';
import DialogForm from '@components/form/DialogForm';
import PropTypes from 'prop-types';
import React from 'react';
import { cancel } from '@shared/window';
import { connect } from 'react-redux';
import { slug } from '@shared/utils';

const mapStateToProps = createStructuredSelector({
  instances: instancesSelector,
  versions: localVersionsSelector,
  loaded: createSelector(instancesLoadedSelector, localVersionsLoadedSelector, (instLoaded, verLoaded) => instLoaded && verLoaded),
  initialValues: createStructuredSelector({
    version: createSelector(highestLocalVersionSelector, v => v && v.name)
  })
});
const mapDispatchToProps = { fetchLocalVersions, fetchLocalInstances, cancel };

const FormLoader = composeComponent(
  setDisplayName('InstancePrompt.Loader'),
  connect(mapStateToProps, mapDispatchToProps),
  onMounted(({ fetchLocalVersions, fetchLocalInstances }) => {
    fetchLocalInstances();
    fetchLocalVersions();
  }),
  ({ loaded, ...props }) => {
    if (!loaded) {
      return null;
    }

    return <Form {...props} />;
  }
);

const validate = ({ name = '' }, { instances }) => {
  const instanceSlug = slug(name);
  const errors = {};

  if (name.length == 0) {
    errors.name = 'Name is required';
  } else if (instances.some(inst => inst.slug === instanceSlug)) {
    errors.name = 'Instance name collides with other instance name.';
  }

  return errors;
};

const Form = composeComponent(
  setDisplayName('InstancePrompt.Form'),
  setPropTypes({
    instances: PropTypes.arrayOf(PropTypes.shape({ slug: PropTypes.string.isRequired }).isRequired).isRequired,
    versions: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired).isRequired,
    cancel: PropTypes.func.isRequired
  }),
  reduxSagaForm({
    form: 'instance-prompt',
    validate
  }),
  ({ handleSubmit, versions, cancel, invalid, submitting }) => {
    const versionsOptions = versions.map(({ name }) => ({ name, value: name }));

    return (
      <DialogForm onSubmit={ handleSubmit }>
        <DialogTitle>New Instance</DialogTitle>
        <DialogContent>
          <TextField label='Instance name' name='name' />
          <Select label='Factorio version' name='version' options={ versionsOptions } />
        </DialogContent>
        <DialogActions>
          <Button onClick={ cancel }>Cancel</Button>
          <Button type='submit' primary disabled={ invalid || submitting }>Create</Button>
        </DialogActions>
      </DialogForm>
    );
  }
);

export default FormLoader;
