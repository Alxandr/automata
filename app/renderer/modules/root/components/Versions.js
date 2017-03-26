import React, { PropTypes } from 'react';
import { composeComponent, onMounted, reduxSagaForm } from '@renderer/utils';
import { download, fetchLocalVersions, localVersionsSelector } from '@shared/versions';

import Button from '@components/Button';
import Icon from '@components/Icon';
import Input from '@components/Input';
import Page from './Page';
import Table from '@components/Table';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { setDisplayName } from 'recompose';

const mapStateToProps = createStructuredSelector({
  local: localVersionsSelector
});

const mapDispatchToProps = { fetchLocal: fetchLocalVersions, download };

const Versions =
  composeComponent(
    setDisplayName('Versions'),
    connect(mapStateToProps, mapDispatchToProps),
    reduxSagaForm({
      form: 'versions'
    }),
    onMounted(({ fetchLocal }) => fetchLocal()),
    ({ local, download }) => {
      const display = local.length > 0 ? (
        <ShowVersions versions={local} />
      ) : (
        'No factorio versions installed.'
      );
      return (
        <Page name="Factorio versions">
          <Button primary onClick={download}><Icon type="plus" /> Download</Button>
          <Page.Hr />
          {display}
        </Page>
      );
    }
  );

const ShowVersions = ({ versions }) => {
  const rows = versions.map(({ name }) => (
    <Table.Row key={name}>
      <Table.Cell><Input.Checkbox name={name} /></Table.Cell>
      <Table.Cell>{name}</Table.Cell>
    </Table.Row>
  ));
  return (
    <Table border bordered>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell />
          <Table.HeaderCell>Version</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows}
      </Table.Body>
    </Table>
  );
};
ShowVersions.propTypes = {
  versions: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Versions;
