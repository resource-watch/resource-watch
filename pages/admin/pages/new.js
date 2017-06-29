import React from 'react';
import PageForm from 'components/admin/pages/form/PageForm';
import Title from 'components/ui/Title';
import Layout from 'components/admin/layout/Layout';

export default class PageNew extends React.Component {

  render() {
    return (
      <Layout
        title="New page"
        description="Edit page description..."
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              Create Static Page
            </Title>
            <LayoutForm
              application={['rw']}
              authorization={process.env.TEMP_TOKEN}
              onSubmit={() => Router.pushRoute('pages')}
              mode="new"
            />
          </div>
        </div>
      </Layout>
    );
  }
}
