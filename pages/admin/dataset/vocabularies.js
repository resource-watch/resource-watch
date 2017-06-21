import React from 'react';
import DatasetVocabulariesForm from 'components/admin/dataset/vocabularies/DatasetVocabulariesForm';
import Page from 'components/admin/layout/Page';

export default class DatasetVocabularies extends React.Component {

  static async getInitialProps({ query }) {
    const datasetID = query.id;
    return { datasetID };
  }

  render() {
    const { datasetID } = this.props;

    return (
      <Page
        title="Dataset Vocabularies"
        description="Dataset Vocabularies description..."
      >
        <div className="row">
          <div className="column small-12">
            <DatasetVocabulariesForm
              application={'rw'}
              authorization={process.env.TEMP_TOKEN}
              language="en"
              dataset={datasetID}
            />
          </div>
        </div>
      </Page>
    );
  }
}
