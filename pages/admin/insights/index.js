import React from 'react';
import Layout from 'components/admin/layout/Layout';
import InsightsTable from 'components/admin/insights/table/InsightsTable';
import ButtonContainer from 'components/ui/ButtonContainer';
import Title from 'components/ui/Title';

export default class InsightsIndex extends React.Component {

  render() {
    return (
      <Layout
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
      </Layout>
    );
  }
}
