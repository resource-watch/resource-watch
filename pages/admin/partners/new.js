import React from 'react';
import PartnerForm from 'components/admin/partners/form/PartnerForm';
import Title from 'components/ui/Title';
import Page from 'components/admin/layout/Page';

export default class PartnerNew extends React.Component {

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
