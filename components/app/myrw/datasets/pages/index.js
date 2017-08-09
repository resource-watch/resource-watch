import React from 'react';

// Components
import DatasetsTable from 'components/datasets/table/DatasetsTable';

function DatasetsIndex() {
  return (
    <div className="c-datasets-index">
      <DatasetsTable
        routes={{
          index: 'myrw',
          detail: 'myrw_detail'
        }}
      />
    </div>
  );
}

export default DatasetsIndex;
