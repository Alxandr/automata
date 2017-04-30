import { Table, TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { allVersionsSelected, download, fetchLocalVersions, localVersionsLoadedSelector, localVersionsSelector, select, selectAll } from '@shared/versions';
import { composeComponent, onMounted } from '@renderer/utils';
import { setDisplayName, setPropTypes } from 'recompose';

import AddIcon from 'material-ui-icons/Add';
import Button from 'material-ui/Button';
import Checkbox from 'material-ui/Checkbox';
import PropTypes from 'prop-types';
import React from 'react';
import Text from 'material-ui/Text';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { createStyleSheet } from 'jss-theme-reactor';
import { withStyleSheet } from '@styles/styled';

const versionPropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired
});

const styleSheet = createStyleSheet('Versions', theme => ({
  root: {
    display: 'flex'
  },

  addButton: {
    position: 'fixed',
    right: theme.spacing.unit * 3,
    bottom: theme.spacing.unit * 3
  }
}));

const mapDispatchToVersionRowProps = (dispatch, { version: { name } }) => ({
  select: () => dispatch(select(name))
});

const VersionRow = composeComponent(
  setDisplayName('VersionRow'),
  setPropTypes({
    version: versionPropType
  }),
  connect(null, mapDispatchToVersionRowProps),
  ({ version: { name, selected }, select }) => (
    <TableRow hover role='checkbox' aria-checked={ false } tabIndex='-1' selected={ selected } onClick={ select }>
      <TableCell checkbox>
        <Checkbox checked={ selected } />
      </TableCell>
      <TableCell disablePadding>{ name }</TableCell>
    </TableRow>
  )
);

const mapStateToShowVersionProps = createStructuredSelector({
  allSelected: allVersionsSelected
});

const mapDispatchToShowVersionProps = {
  selectAll
};

const ShowVersions = composeComponent(
  setDisplayName('ShowVersions'),
  setPropTypes({
    versions: PropTypes.arrayOf(
      versionPropType.isRequired
    ).isRequired
  }),
  connect(mapStateToShowVersionProps, mapDispatchToShowVersionProps),
  ({ versions, allSelected, selectAll }) => {
    const rows = versions.map(v => <VersionRow key={ v.name } version={ v } />);

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell checkbox>
              <Checkbox checked={ allSelected } onChange={ selectAll } />
            </TableCell>
            <TableCell disablePadding>Version</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { rows }
        </TableBody>
      </Table>
    );
  }
);

const mapStateToProps = createStructuredSelector({
  local: localVersionsSelector,
  loaded: localVersionsLoadedSelector
});

const mapDispatchToProps = { fetchLocal: fetchLocalVersions, download };

const Versions = composeComponent(
  setDisplayName('Versions'),
  connect(mapStateToProps, mapDispatchToProps),
  onMounted(({ fetchLocal }) => fetchLocal()),
  withStyleSheet(styleSheet),
  ({ classes, local, download, loaded }) => {
    if (!loaded) {
      return null;
    }

    const display = local.length > 0 ? (
      <ShowVersions versions={local} />
    ) : (
      <Text type='headline'>No factorio versions installed.</Text>
    );

    return (
      <div className={ classes.root }>
        { display }
        <Button fab primary className={ classes.addButton } onClick={ download }>
          <AddIcon />
        </Button>
      </div>
    );
  }
);

export default Versions;
