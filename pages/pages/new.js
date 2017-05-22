import React from 'react';
import PageForm from 'components/pages/form/PageForm';
import Title from 'components/ui/Title';
import Page from 'components/layout/page';

export default class PageNew extends React.Component {

  render() {
    return (
      <Page
        title="New page"
        description="Edit page description..."
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              Create Static Page
            </Title>
            <PageForm
              application={['rw']}
              authorization={process.env.TEMP_TOKEN}
              onSubmit={() => Router.pushRoute('pages')}
              mode="new"
            />
          </div>
        </div>
      </Page>
    );
  }
}
