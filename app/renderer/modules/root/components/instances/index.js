import { Card, CardActions, CardContent, CardMedia } from 'material-ui/Card';
import { composeComponent, onMounted } from '@renderer/utils';
import { createInstance, fetchLocalInstances, instancesSelector, start } from '@shared/instances';
import { setDisplayName, setPropTypes } from 'recompose';

import AddIcon from 'material-ui-icons/Add';
import Button from 'material-ui/Button';
import PropTypes from 'prop-types';
import React from 'react';
import Text from 'material-ui/Text';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { createStyleSheet } from 'jss-theme-reactor';
import { withStyleSheet } from '@styles/styled';

const styleSheet = createStyleSheet('Instances', theme => ({
  root: {
    display: 'flex'
  },

  addButton: {
    position: 'fixed',
    right: theme.spacing.unit * 3,
    bottom: theme.spacing.unit * 3
  },

  card: {
    width: 256
  }
}));

const instanceShape = {
  name: PropTypes.string.isRequired,
  version: PropTypes.string,
  icon: PropTypes.string,
  numSaves: PropTypes.number.isRequired
};

const mapInstanceDispatchToProps = (dispatch, props) => ({
  start: () => dispatch(start(props._id))
});

const Instance = composeComponent(
  setDisplayName('Instance'),
  setPropTypes(instanceShape),
  connect(null, mapInstanceDispatchToProps),
  withStyleSheet(styleSheet),
  ({ classes, name, icon, start, numSaves, mods }) => (
    <Card className={ classes.card }>
      <CardMedia onClick={ start }>
        <img src={ icon } />
      </CardMedia>
      <CardContent>
        <Text type="headline" component="h2">{ name }</Text>
        <Text component="p">Number of mods: { mods.length }</Text>
        <Text component="p">Number of saves: { numSaves }</Text>
      </CardContent>
    </Card>
  )
);

const ShowInstances = composeComponent(
  setDisplayName('ShowInstances'),
  setPropTypes({
    instances: PropTypes.arrayOf(
      PropTypes.shape(instanceShape).isRequired
    ).isRequired
  }),
  ({ instances }) => {
    const instanceCards = instances.map(inst => <Instance { ...inst } key={ inst._id } />);

    return <div>{ instanceCards }</div>;
  }
);

const mapStateToProps = createStructuredSelector({
  local: instancesSelector
});

const mapDispatchToProps = { fetchLocal: fetchLocalInstances, createInstance };

const Instances = composeComponent(
  setDisplayName('Instances'),
  connect(mapStateToProps, mapDispatchToProps),
  onMounted(({ fetchLocal }) => fetchLocal()),
  withStyleSheet(styleSheet),
  ({ classes, local, createInstance }) => {
    const display = local.length > 0 ? (
      <ShowInstances instances={local} />
    ) : (
      <Text type='headline'>No instances configured.</Text>
    );

    return (
      <div className={ classes.root }>
        { display }
        <Button fab primary className={ classes.addButton } onClick={ createInstance }>
          <AddIcon />
        </Button>
      </div>
    );
  }
);

export default Instances;
