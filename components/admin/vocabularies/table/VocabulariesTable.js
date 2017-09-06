import React from 'react';
import PropTypes from 'prop-types';

// Components
import CustomTable from 'components/ui/customtable/CustomTable';

function VocabulariesTable(props) {
  return (
    <div className="c-vocabularies-table">
      <CustomTable
        columns={[
          { label: 'name', value: 'name' }
        ]}
        actions={{ show: false, list: [] }}
        data={props.vocabularies}
        pageSize={20}
        pagination={{
          enabled: true,
          pageSize: 20,
          page: 0
        }}
      />
    </div>
  );
}

VocabulariesTable.defaultProps = {
  application: [],
  columns: [],
  actions: {}
};

VocabulariesTable.propTypes = {
  vocabularies: PropTypes.array
};

export default VocabulariesTable;
