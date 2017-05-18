import React from 'react';
import DatasetVocabulariesForm from 'components/dataset/vocabularies/DatasetVocabulariesForm';

export default class DatasetVocabularies extends React.Component {

  render() {
    return (
      <div className="row">
        <div className="column small-12">
          <DatasetVocabulariesForm
            application={'rw'}
            authorization={gon.data.authorization}
            language="en"
            dataset={gon.data.dataset_id}
          />
        </div>
      </div>
    );
  }
}
