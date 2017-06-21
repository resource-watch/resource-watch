import React from 'react';
import Page from 'components/admin/layout/Page';
import PartnersTable from 'components/admin/partners/table/PartnersTable';
import ButtonContainer from 'components/ui/ButtonContainer';
import Title from 'components/ui/Title';

export default class PartnersIndex extends React.Component {

  render() {
    return (
      <Page
        title="Partners"
        description="Partners description..."
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              Partners
            </Title>
            <ButtonContainer
              className="-end"
              buttons={[{
                label: 'New +',
                path: '/admin/partners/new',
                className: ''
              }]}
            />
            <PartnersTable
              application={['rw']}
              authorization={process.env.TEMP_TOKEN}
            />
          </div>
        </div>
      </Page>
    );
  }
}
