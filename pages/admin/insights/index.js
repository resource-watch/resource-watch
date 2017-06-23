import React from 'react';
import Page from 'components/admin/layout/Page';
import InsightsTable from 'components/admin/insights/table/InsightsTable';
import ButtonContainer from 'components/ui/ButtonContainer';
import Title from 'components/ui/Title';

export default class InsightsIndex extends React.Component {

  render() {
    return (
      <Page
        title="Insights"
        description="Insights description..."
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              Insights
            </Title>
            <ButtonContainer
              className="-j-end"
              buttons={[{
                label: 'New +',
                path: '/admin/insights/new',
                className: ''
              }]}
            />
            <InsightsTable
              application={['rw']}
              authorization={process.env.TEMP_TOKEN}
            />
          </div>
        </div>
      </Page>
    );
  }
}
