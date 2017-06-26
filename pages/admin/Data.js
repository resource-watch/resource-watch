import React from 'react';
import Page from 'components/admin/layout/Page';
import DatasetTable from 'components/admin/dataset/table/DatasetTable';
import ButtonContainer from 'components/ui/ButtonContainer';
import Title from 'components/ui/Title';

// Contants
const DATA_TABS = [{
  label: 'Datasets',
  value: 'datasets',
  route: 'data',
  params: { tab: 'datasets' }
}, {
  label: 'Widgets',
  value: 'widgets',
  route: 'data',
  params: { tab: 'widgets' }
}, {
  label: 'Layers',
  value: 'layers',
  route: 'myrw',
  params: { tab: 'layers' }
}, {
  label: 'Dashboards',
  value: 'dashboards',
  route: 'data',
  params: { tab: 'dashboards' }
}, {
  label: 'Vocabularies',
  value: 'vocabularies',
  route: 'data',
  params: { tab: 'vocabularies' }
}];

export default class Data extends React.Component {

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
        title="Data"
        description="Data description..."
      >
        {/* PAGE HEADER */}
        <div className="c-page-header">
          <div className="l-container">
            <div className="page-header-content -padding-b-2">
              <Breadcrumbs
                items={[{ name: 'Explore datasets', url: 'explore' }]}
              />

              <Title className="-primary -huge page-header-title" >
                Data
              </Title>

              <div className="page-header-info">
                <ul>
                  <li>Source: {(metadata && metadata.length > 0 && metadata[0].source) || '-'}</li>
                  <li>Last update: {dataset && dataset.attributes && new Date(dataset.attributes.updatedAt).toJSON().slice(0, 10).replace(/-/g, '/')}</li>
                  {/* Favorites <li>Last update: {dataset && dataset.attributes && dataset.attributes.updatedAt}</li> */}
                </ul>
              </div>
            </div>
          </div>
        </div>
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
