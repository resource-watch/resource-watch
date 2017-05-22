import React from 'react';
import InsightForm from 'components/insights/form/InsightForm';
import Title from 'components/ui/Title';
import Page from 'components/layout/page';

export default class InsightEdit extends React.Component {

  render() {
    return (
      <Page
        title="New insight"
        description="Edit insight description..."
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              Create Partner
            </Title>
            <InsightForm
              application={['rw']}
              authorization={process.env.TEMP_TOKEN}
              onSubmit={() => Router.pushRoute('insights')}
              mode="new"
            />
          </div>
        </div>
      </Page>
    );
  }
}
