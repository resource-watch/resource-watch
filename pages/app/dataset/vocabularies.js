import React from 'react';
import DatasetVocabulariesForm from 'components/admin/dataset/vocabularies/DatasetVocabulariesForm';
import Layout from 'components/admin/layout/Layout';

export default class DatasetVocabularies extends React.Component {

  static async getInitialProps({ query }) {
    const datasetID = query.id;
    return { datasetID };
  }

  render() {
    const { datasetID } = this.props;

    return (
      <Layout
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
      </Layout>
    );
  }
}
