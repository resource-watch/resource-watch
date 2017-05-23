import React from 'react';
import WidgetTable from 'components/widget/table/WidgetTable';
import ButtonContainer from 'components/ui/ButtonContainer';
import Title from 'components/ui/Title';
import Page from 'components/layout/page';

export default class WidgetIndex extends React.Component {

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
              Widgets
            </Title>

            <ButtonContainer
              className="-end"
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
      </Page>
    );
  }
}
