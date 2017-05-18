import React from 'react';
import VocabulariesForm from 'components/vocabularies/form/VocabulariesForm';
import Page from 'components/layout/page';

export default class VocabulariesIndex extends React.Component {

  render() {
    return (
      <Page
        title="Vocabularies"
        description="Vocabularies description..."
      >
        <div className="row">
          <div className="column small-12">
            <VocabulariesForm
              application={'rw'}
              authorization={`${process.env.TEMP_TOKEN}`}
              language="en"
            />
          </div>
        </div>
      </Page>
    );
  }
}
