import React from 'react';
import Title from 'components/ui/Title';
import MetadataForm from 'components/metadata/form/MetadataForm';
import { Router } from '../../routes';
import Page from 'components/layout/page';

export default class DatasetMetadata extends React.Component {

  static async getInitialProps({ query }) {
    const datasetID = query.id;
    return { datasetID };
  }

  render() {
    const { datasetID } = this.props;

    return (
      <Page
        title="Dataset Metadata"
        description="Dataset Metadata description..."
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              Metadata
            </Title>
            <MetadataForm
              application={'rw'}
              authorization={process.env.TEMP_TOKEN}
              dataset={datasetID}
              onSubmit={() => Router.pushRoute('datasets')}
            />
          </div>
        </div>
      </Page>
    );
  }
}
