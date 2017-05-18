import React from 'react';
import Title from 'components/ui/Title';
import Page from 'components/layout/page';
import DatasetForm from 'components/dataset/form/DatasetForm';
import { Router } from '../../routes';

export default class DatasetNew extends React.Component {

  render() {
    return (
      <Page
        title="New dataset"
        description="New dataset description..."
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              New Dataset
            </Title>
            <DatasetForm
              application={['rw']}
              authorization={`${process.env.TEMP_TOKEN}`}
              onSubmit={() => Router.pushRoute('datasets')}
            />
          </div>
        </div>
      </Page>
    );
  }
}
