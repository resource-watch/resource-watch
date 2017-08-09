import React from 'react';

// Components
import DatasetsTable from 'components/datasets/table/DatasetsTable';
// import DatasetsList from 'components/datasets/list/DatasetsList';

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
