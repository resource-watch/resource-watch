import React from 'react';
import WidgetForm from 'components/admin/widget/form/WidgetForm';
import Title from 'components/ui/Title';
import Layout from 'components/admin/layout/Layout';

export default class WidgetEdit extends React.Component {

  static async getInitialProps({ query }) {
    console.log('query', query);
    const datasetID = query.id;
    const widgetID = query.widget_id;
    return { datasetID, widgetID };
  }

  render() {
    const { datasetID, widgetID } = this.props;
    return (
      <Layout
        title="Edit widget"
        description="Edit widget description..."
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              Edit Widget
            </Title>
            <WidgetForm
              application={['rw']}
              authorization={process.env.TEMP_TOKEN}
              dataset={datasetID}
              widget={widgetID}
              onSubmit={() => Router.pushRoute('dataset_widgets', { id: datasetID })}
            />
          </div>
        </div>
      </Layout>
    );
  }
}
