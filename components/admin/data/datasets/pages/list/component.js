import React, { PureComponent } from 'react';

// components
import DatasetsTable from 'components/datasets/table';

class DatasetsIndex extends PureComponent {
  render() {
    return (
      <div className="c-datasets-index">
        <DatasetsTable
          routes={{
            index: 'admin_data',
            detail: 'admin_data_detail'
          }}
        />
      </div>
    );
  }
}

export default DatasetsIndex;
