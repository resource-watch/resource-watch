import React from 'react';
import Page from 'components/layout/page';
import DatasetTable from 'components/dataset/table/DatasetTable';
import ButtonContainer from 'components/ui/ButtonContainer';
import Title from 'components/ui/Title';

export default class DatasetIndex extends React.Component {

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
              className="-end"
              buttons={[{
                label: 'New +',
                path: '/datasets/new',
                className: ''
              }]}
            />
            <DatasetTable
              application={['rw']}
              authorization={`${process.env.TEMP_TOKEN}`}
            />
          </div>
        </div>
      </Page>
    );
  }
}
