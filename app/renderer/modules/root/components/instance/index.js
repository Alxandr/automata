import { composeComponent, onMounted } from '@renderer/utils';
import { fetchLocalInstances, instancesSelector, start } from '@shared/instances';
import { setDisplayName, setPropTypes } from 'recompose';

import Button from 'material-ui/Button';
import PlayArrowIcon from 'material-ui-icons/PlayArrow';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { createStyleSheet } from 'jss-theme-reactor';
import { withStyleSheet } from '@styles/styled';

const styleSheet = createStyleSheet('Instance', theme => ({
  root: {
    display: 'flex'
  },

  startButton: {
    position: 'fixed',
    right: theme.spacing.unit * 3,
    bottom: theme.spacing.unit * 3
  }
}));

const currentInstanceSelector = (state, props) =>
  instancesSelector(state).find(inst => inst.slug === props.match.params.slug) || null;

const mapStateToProps = createStructuredSelector({
  instance: currentInstanceSelector
});

const mapDispatchToProps = (dispatch, props) => ({
  fetchLocal: () => dispatch(fetchLocalInstances()),
  start: () => {
    dispatch(start(`instances/${props.match.params.slug}`));
  }
});

const Instance = composeComponent(
  setDisplayName('Instance'),
  setPropTypes({
    match: PropTypes.shape({
      params: PropTypes.shape({
        slug: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }),
  connect(mapStateToProps, mapDispatchToProps),
  onMounted(({ fetchLocal }) => fetchLocal()),
  withStyleSheet(styleSheet),
  ({ classes, instance, start }) => {
    if (instance === null) return null;

    return (
      <div className={ classes.root }>
        <Button fab primary className={ classes.startButton } onClick={ start }>
          <PlayArrowIcon />
        </Button>
      </div>
    );
  }
);

export default Instance;
