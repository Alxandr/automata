import React, { PropTypes } from 'react';
import { composeComponent, onMounted } from '@renderer/utils';
import { download, fetchLocalVersions, localVersionsSelector } from '@shared/versions';

import Button from '@components/Button';
import Icon from '@components/Icon';
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
