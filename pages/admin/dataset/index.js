import React from 'react';
import Page from 'components/admin/layout/Page';
import DatasetTable from 'components/admin/dataset/table/DatasetTable';
import ButtonContainer from 'components/ui/ButtonContainer';
import Title from 'components/ui/Title';

export default class DatasetIndex extends React.Component {

  constructor(props) {
    super(props);

    const { url } = props;

    this.state = {
      tab: url.query.tab || 'datasets',
      subtab: url.query.subtab
    };
  }

  render() {
    return (
      <Page
        title="Datasets"
        description="Dataset description..."
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              Datasets
            </Title>
            <ButtonContainer
              className="-j-end"
              buttons={[{
                label: 'New +',
                path: '/admin/datasets/new',
                className: ''
              }]}
            />
            <DatasetTable
              application={['rw']}
              authorization={process.env.TEMP_TOKEN}
            />
          </div>
        </div>
      </Page>
    );
  }
}
