import { composeComponent, onMounted } from '@renderer/utils';
import {
  fetchLocalInstances,
  instancesSelector,
  start,
} from '@shared/instances';
import { setDisplayName, setPropTypes } from 'recompose';

import Button from 'material-ui/Button';
import PageInfo from '../pageinfo';
import PlayArrowIcon from 'material-ui-icons/PlayArrow';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withStyles } from '@styles/styled';

const styles = theme => ({
  root: {
    display: 'flex',
  },

  startButton: {
    position: 'fixed',
    right: theme.spacing.unit * 3,
    bottom: theme.spacing.unit * 3,
  },
});

const currentInstanceSelector = (state, props) =>
  instancesSelector(state).find(
    inst => inst.slug === props.match.params.slug,
  ) || null;

const mapStateToProps = createStructuredSelector({
  instance: currentInstanceSelector,
});

const mapDispatchToProps = (dispatch, props) => ({
  fetchLocal: () => dispatch(fetchLocalInstances()),
  start: () => {
    dispatch(start(`instances/${props.match.params.slug}`));
  },
});

const Instance = composeComponent(
  connect(mapStateToProps, mapDispatchToProps),
  onMounted(({ fetchLocal }) => fetchLocal()),
  withStyles(styles),
  setDisplayName('Instance'),
  setPropTypes({
    match: PropTypes.shape({
      params: PropTypes.shape({
        slug: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }),
  ({ classes, instance, start }) => {
    if (instance === null) return null;

    return (
      <div className={classes.root}>
        <PageInfo title={instance.name} />
        <Button
          fab
          color="primary"
          className={classes.startButton}
          onClick={start}
        >
          <PlayArrowIcon />
        </Button>
      </div>
    );
  },
);

export default Instance;
