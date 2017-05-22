import React from 'react';
import PartnerForm from 'components/partners/form/PartnerForm';
import Title from 'components/ui/Title';
import Page from 'components/layout/page';
import { Router } from '../../routes';

export default class PartnerEdit extends React.Component {

  static async getInitialProps({ query }) {
    const partnerID = query.id;
    return { partnerID };
  }

  render() {
    const { partnerID } = this.props;
    return (
      <Page
        title="Edit partner"
        description="Edit partner description..."
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              Edit Partner
            </Title>
            <PartnerForm
              application={['rw']}
              authorization={process.env.TEMP_TOKEN}
              partner={partnerID}
              onSubmit={() => Router.pushRoute('partners')}
              mode="edit"
            />
          </div>
        </div>
      </Page>
    );
  }
}
