import React from 'react';
import DatasetForm from 'components/dataset/form/DatasetForm';
import Title from 'components/ui/Title';

export default class DatasetEdit extends React.Component {

  static async getInitialProps({ query }) {
    const datasetID = query.id;
    return { datasetID };
  }

  render() {
    const { datasetID } = this.props;
    return (
      <div className="row">
        <div className="column small-12">
          <Title className="-huge -p-primary">
            Edit Dataset
          </Title>
          <DatasetForm
            application={['rw']}
            authorization={`${process.env.TEMP_TOKEN}`}
            dataset={datasetID}
            onSubmit={() => window.location = '/datasets'}
          />
        </div>
      </div>
    );
  }
}
