import React from 'react';
import { Router } from 'routes';

// Components
import DatasetForm from 'components/admin/dataset/form/DatasetForm';

export default class DatasetNew extends React.Component {

  render() {
    return (
      <div className="c-datasets-new">
        <DatasetForm
          application={['rw']}
          authorization={`${process.env.TEMP_TOKEN}`}
          onSubmit={() => Router.pushRoute('admin_data', { tab: 'datasets' })}
        />
      </div>
    );
  }
}
