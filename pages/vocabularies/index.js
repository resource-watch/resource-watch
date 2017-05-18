import React from 'react';
import VocabulariesForm from 'components/vocabularies/VocabulariesForm';

class VocabulariesIndex extends React.Component {

  render() {
    return (
      <div className="row">
        <div className="column small-12">
          <VocabulariesForm
            application={'rw'}
            authorization={gon.data.authorization}
            language="en"
          />
        </div>
      </div>
    );
  }
}
