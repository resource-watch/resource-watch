import React from 'react';
import WidgetTable from 'components/admin/widget/table/WidgetTable';
import ButtonContainer from 'components/ui/ButtonContainer';
import Title from 'components/ui/Title';
import Layout from 'components/admin/layout/Layout';

export default class WidgetIndex extends React.Component {

  static async getInitialProps({ query }) {
    const datasetID = query.id;
    return { datasetID };
  }

  render() {
    const { datasetID } = this.props;
    return (
      <Layout
        title="Dataset widgets"
        description="Dataset widgets description"
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              Widgets
            </Title>

            <ButtonContainer
              className="-j-end"
              buttons={[{
                label: 'New +',
                path: `/admin/datasets/${datasetID}/widgets/new`,
                className: ''
              }]}
            />

            <WidgetTable
              application={['rw']}
              dataset={datasetID}
              authorization={process.env.TEMP_TOKEN}
            />
          </div>
        </div>
      </Layout>
    );
  }
}
