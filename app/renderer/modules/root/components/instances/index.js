import Card, { CardContent, CardMedia } from 'material-ui/Card';
import { composeComponent, onMounted } from '@renderer/utils';
import {
  createInstance,
  fetchLocalInstances,
  instancesSelector,
  start,
} from '@shared/instances';
import { setDisplayName, setPropTypes } from 'recompose';

import AddIcon from 'material-ui-icons/Add';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import PlayArrowIcon from 'material-ui-icons/PlayArrow';
import PropTypes from 'prop-types';
import React from 'react';
import Text from 'material-ui/Typography';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { createStyleSheet } from 'material-ui/styles';
import { push as routerPush } from '@shared/router';
import { withStyles } from '@styles/styled';

const styles = createStyleSheet('Instances', theme => ({
  root: {
    display: 'flex',
  },

  addButton: {
    position: 'fixed',
    right: theme.spacing.unit * 3,
    bottom: theme.spacing.unit * 3,
  },

  card: {
    width: 200,
    margin: 10,
    flex: 'none',
  },

  cardMedia: {
    width: 200,
    height: 200,
  },

  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, .4)',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0,
    transition: 'opacity .5s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '&:hover': {
      opacity: 1,
    },
  },

  playIcon: {
    height: 72,
    width: 72,
  },

  overlayButton: {
    color: 'white',
    width: 72,
    height: 72,
    border: '1px solid white',
    transition: 'background-color .5s',
    backgroundColor: 'rgba(255, 255, 255, 0)',

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, .4)',
    },
  },

  instances: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexWrap: 'wrap',
  },
}));

const instanceShape = {
  name: PropTypes.string.isRequired,
  version: PropTypes.string,
  icon: PropTypes.string,
  numSaves: PropTypes.number.isRequired,
};

const mapInstanceDispatchToProps = (dispatch, props) => ({
  start: evt => {
    evt.stopPropagation();
    dispatch(start(props._id));
  },
  // id is `instances/instance-slug`, thus I don't need to add that.
  view: () => dispatch(routerPush(`/${props._id}`)),
});

const Instance = composeComponent(
  connect(null, mapInstanceDispatchToProps),
  withStyles(styles),
  setDisplayName('Instance'),
  setPropTypes(instanceShape),
  ({ classes, name, icon, start, numSaves, mods, view }) =>
    <Card className={classes.card} onClick={view}>
      <CardMedia className={classes.cardMedia}>
        <img src={icon || 'images/factorio.png'} />
        <div className={classes.overlay}>
          <IconButton onClick={start} className={classes.overlayButton}>
            <PlayArrowIcon className={classes.playIcon} />
          </IconButton>
        </div>
      </CardMedia>
      <CardContent>
        <Text type="headline" component="h2">
          {name}
        </Text>
        <Text component="p">
          Number of mods: {mods.length}
        </Text>
        <Text component="p">
          Number of saves: {numSaves}
        </Text>
      </CardContent>
    </Card>,
);

const ShowInstances = composeComponent(
  withStyles(styles),
  setDisplayName('ShowInstances'),
  setPropTypes({
    instances: PropTypes.arrayOf(PropTypes.shape(instanceShape).isRequired)
      .isRequired,
  }),
  ({ instances, classes }) => {
    const instanceCards = instances.map(inst =>
      <Instance {...inst} key={inst._id} />,
    );

    return (
      <div className={classes.instances}>
        {instanceCards}
      </div>
    );
  },
);

const mapStateToProps = createStructuredSelector({
  local: instancesSelector,
});

const mapDispatchToProps = { fetchLocal: fetchLocalInstances, createInstance };

const Instances = composeComponent(
  connect(mapStateToProps, mapDispatchToProps),
  onMounted(({ fetchLocal }) => fetchLocal()),
  withStyles(styles),
  setDisplayName('Instances'),
  ({ classes, local, createInstance }) => {
    const display =
      local.length > 0
        ? <ShowInstances instances={local} />
        : <Text type="headline">No instances configured.</Text>;

    return (
      <div className={classes.root}>
        {display}
        <Button
          fab
          color="primary"
          className={classes.addButton}
          onClick={createInstance}
        >
          <AddIcon />
        </Button>
      </div>
    );
  },
);

export default Instances;
