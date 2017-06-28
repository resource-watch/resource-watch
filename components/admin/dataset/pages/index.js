import React from 'react';
import DatasetTable from 'components/admin/dataset/table/DatasetTable';
import ButtonContainer from 'components/ui/ButtonContainer';

export default function DatasetIndex() {
  return (
    <div className="c-datasets-index">
      <ButtonContainer
        className="-j-end"
        buttons={[{
          label: 'New +',
          route: 'admin_data_detail',
          params: { tab: 'datasets', id: 'new' },
          className: ''
        }]}
      />
      <DatasetTable
        application={['rw']}
        authorization={process.env.TEMP_TOKEN}
      />
    </div>
  );
}
