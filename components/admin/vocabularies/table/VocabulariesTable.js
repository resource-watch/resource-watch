import React from 'react';
import CustomTable from 'components/ui/customtable/CustomTable';

class VocabulariesTable extends React.Component {

  render() {
    return (
      <div className="c-vocabularies-table">
        <CustomTable
          columns={[
            { label: 'name', value: 'name' }
          ]}
          actions={{ show: false, list: [] }}
          data={this.props.vocabularies}
          pageSize={20}
          pagination={{
            enabled: true,
            pageSize: 20,
            page: 0
          }}
          onToggleSelectedRow={(ids) => { console.info(ids); }}
          onRowDelete={(id) => { console.info(id); }}
        />
      </div>
    );
  }
}

VocabulariesTable.defaultProps = {
  application: [],
  columns: [],
  actions: {}
};

VocabulariesTable.propTypes = {
  application: React.PropTypes.array.isRequired,
  authorization: React.PropTypes.string,
  vocabularies: React.PropTypes.array
};

export default VocabulariesTable;
