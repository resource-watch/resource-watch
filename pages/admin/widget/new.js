import React from 'react';
import WidgetForm from 'components/admin/widget/form/WidgetForm';
import Title from 'components/ui/Title';
import Page from 'components/admin/layout/page';
import { Router } from 'routes';

export default class WidgetNew extends React.Component {

  static async getInitialProps({ query }) {
    const datasetID = query.id;
    return { datasetID };
  }

  render() {
    const { datasetID } = this.props;
    return (
      <Page
        title="Dataset widgets"
        description="Dataset widgets description"
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              New Widget
            </Title>
            <WidgetForm
              application={['rw']}
              authorization={process.env.TEMP_TOKEN}
              dataset={datasetID}
              onSubmit={() => Router.pushRoute('dataset_widgets', { id: datasetID })}
            />
          </div>
        </div>
      </Page>
    );
  }
}
