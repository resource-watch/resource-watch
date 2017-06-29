import React from 'react';
import VocabulariesForm from 'components/admin/vocabularies/form/VocabulariesForm';
import Layout from 'components/admin/layout/Layout';

export default class VocabulariesIndex extends React.Component {

  render() {
    return (
      <Layout
        title="Vocabularies"
        description="Vocabularies description..."
      >
        <div className="row">
          <div className="column small-12">
            <VocabulariesForm
              application={'rw'}
              authorization={process.env.TEMP_TOKEN}
              language="en"
            />
          </div>
        </div>
      </Layout>
    );
  }
}
