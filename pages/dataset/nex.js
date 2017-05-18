import React from 'react';
import Title from 'components/ui/Title';
import DatasetForm from 'components/dataset/form/DatasetForm';

export default class DatasetNew extends React.Component {

  render() {
    <div className="row">
      <div className="column small-12">
        <Title className="-huge -p-primary">
          New Dataset
        </Title>
        <DatasetForm
          application={['rw']}
          authorization={gon.data.authorization}
          onSubmit={() => window.location = "/datasets"}
        />
      </div>
    </div>
    );
  }
}
