import React from 'react';
import Layout from 'components/admin/layout/Layout';
import PartnersTable from 'components/admin/partners/table/PartnersTable';
import ButtonContainer from 'components/ui/ButtonContainer';
import Title from 'components/ui/Title';

export default class PartnersIndex extends React.Component {

  render() {
    return (
      <Layout
        title="Partners"
        description="Partners description..."
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              Partners
            </Title>
            <ButtonContainer
              className="-j-end"
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
      </Layout>
    );
  }
}
