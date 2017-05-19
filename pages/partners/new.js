import React from 'react';
import Title from 'components/ui/Title';
import Page from 'components/layout/page';
import { Router } from '../../routes';

export default class DatasetNew extends React.Component {

  render() {
    return (
      <Page
        title="New partner"
        description="New partner description..."
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              New Partner
            </Title>
          </div>
        </div>
      </Page>
    );
  }
}
