import React from 'react';
import PageForm from 'components/admin/pages/form/PageForm';
import Title from 'components/ui/Title';
import Page from 'components/admin/layout/Page';
import { Router } from 'routes';

export default class PageEdit extends React.Component {

  static async getInitialProps({ query }) {
    const pageID = query.id;
    return { pageID };
  }

  render() {
    const { pageID } = this.props;
    return (
      <Page
        title="Edit page"
        description="Edit page description..."
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              Edit Page
            </Title>
            <PageForm
              application={['rw']}
              authorization={process.env.TEMP_TOKEN}
              page={pageID}
              onSubmit={() => Router.pushRoute('pages')}
              mode="edit"
            />
          </div>
        </div>
      </Page>
    );
  }
}
