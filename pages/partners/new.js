import React from 'react';
import PartnerForm from 'components/partners/form/PartnerForm';
import Title from 'components/ui/Title';
import Page from 'components/layout/page';

export default class PartnerEdit extends React.Component {

  render() {
    return (
      <Page
        title="New partner"
        description="Edit partner description..."
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              Create Partner
            </Title>
            <PartnerForm
              application={['rw']}
              authorization={process.env.TEMP_TOKEN}
              onSubmit={() => Router.pushRoute('partners')}
              mode="new"
            />
          </div>
        </div>
      </Page>
    );
  }
}
