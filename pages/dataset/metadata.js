import React from 'react';
import Title from 'components/ui/Title';
import MetadataForm from 'components/metadata/MetadataForm';
import { Router } from '../../routes';

export default class DatasetMetadata extends React.Component {

  render() {
    return (
      <div className="row">
        <div className="column small-12">
          <Title className="-huge -p-primary">
            Metadata
          </Title>
          <MetadataForm
            application={'rw'}
            authorization={gon.data.authorization}
            dataset={gon.data.dataset_id}
            onSubmit={() => Router.pushRoute('datasets')}
          />
        </div>
      </div>
    );
  }
}
