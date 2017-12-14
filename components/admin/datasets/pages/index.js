import React from 'react';

// Components
import DatasetsTable from 'components/datasets/table/DatasetsTable';

function DatasetsIndex() {
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

export default DatasetsIndex;
