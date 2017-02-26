import React, { PropTypes } from 'react';
import { setDisplayName } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Page from './Page';
import Icon from '@components/Icon';
import Button from '@components/Button';
import Table from '@components/Table';
import { download, fetchLocalVersions, localVersionsSelector } from '@shared/versions';
import { composeComponent, onMounted } from '@renderer/utils';

const mapStateToProps = createStructuredSelector({
  local: localVersionsSelector
});

const mapDispatchToProps = { fetchLocal: fetchLocalVersions, download };

const Versions =
  composeComponent(
    setDisplayName('Versions'),
    connect(mapStateToProps, mapDispatchToProps),
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
  return (
    <Table border bordered>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell />
          <Table.HeaderCell>Version</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    </Table>
  );
};
ShowVersions.propTypes = {
  versions: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Versions;
