import React from 'react';
import PageForm from 'components/admin/pages/form/PageForm';
import Title from 'components/ui/Title';
import Layout from 'components/admin/layout/Layout';
import { Router } from '../../../routes';

export default class PageEdit extends React.Component {

  static async getInitialProps({ query }) {
    const pageID = query.id;
    return { pageID };
  }

  render() {
    const { pageID } = this.props;
    return (
      <Layout
        title="Edit page"
        description="Edit page description..."
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              Edit Page
            </Title>
            <LayoutForm
              application={['rw']}
              authorization={process.env.TEMP_TOKEN}
              page={pageID}
              onSubmit={() => Router.pushRoute('pages')}
              mode="edit"
            />
          </div>
        </div>
      </Layout>
    );
  }
}
