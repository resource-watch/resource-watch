import React from 'react';
import sortBy from 'lodash/sortBy';

// Components
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';

// Table components
import MetadataAction from './actions/MetadataAction';
import VocabularyAction from './actions/VocabularyAction';
import WidgetAction from './actions/WidgetAction';
import LayerAction from './actions/LayerAction';
import EditAction from './actions/EditAction';
import DeleteAction from './actions/DeleteAction';
import StatusTD from './td/StatusTD';

class DatasetTable extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      datasets: [],
      loading: true
    };
  }

  componentDidMount() {
    this.getDatasets();
  }

  /**
   * HELPERS
   * - getDatasets
  */
  getDatasets() {
    const { application } = this.props;
    const url = `${process.env.WRI_API_URL}/dataset?application=${application.join(',')}&includes=widget,layer,metadata&page[size]=${Date.now() / 100000}`;

    fetch(new Request(url))
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then((response) => {
        const datasets = sortBy(response.data.map(dataset =>
          Object.assign({}, dataset.attributes, {
            id: dataset.id
          })
        ), 'name');
        this.setState({ datasets, loading: false });
      })
      .catch(() => {
        this.setState({ message: 'Error loading datasets', loading: false });
      });
  }

  render() {
    return (
      <div className="c-dataset-table">
        <Spinner className="-light" isLoading={this.state.loading} />
        <CustomTable
          columns={[
            { label: 'name', value: 'name' },
            { label: 'status', value: 'status', td: StatusTD },
            { label: 'provider', value: 'provider' }
          ]}
          actions={{
            show: true,
            list: [
              { name: 'Edit', route: 'admin_data', params: { tab: 'datasets', subtab: 'edit', id: ':id' }, path: '/admin/data/datasets/:id/edit', show: true, component: EditAction },
              { name: 'Remove', route: 'admin_data', params: { tab: 'datasets', subtab: 'remove', id: ':id' }, path: '/admin/data/datasets/:id/remove', component: DeleteAction, componentProps: { authorization: this.props.authorization } },
              { name: 'Metadata', route: 'admin_data', params: { tab: 'datasets', subtab: 'metadata', id: ':id' }, path: '/admin/data/datasets/:id/metadata', component: MetadataAction },
              { name: 'Vocabularies', route: 'admin_data', params: { tab: 'datasets', subtab: 'vocabularies', id: ':id' }, path: '/admin/data/datasets/:id/vocabularies', component: VocabularyAction },
              { name: 'Widgets', route: 'admin_data', params: { tab: 'datasets', subtab: 'widgets', id: ':id' }, path: '/admin/data/datasets/:id/widgets', component: WidgetAction }
              // { name: 'Layers', route: 'admin_data', params: { tab: 'datasets', subtab: 'layers', id: ':id' }, path: '/admin/data/datasets/:id/layers', component: LayerAction }
            ]
          }}
          data={this.state.datasets}
          pageSize={20}
          pagination={{
            enabled: true,
            pageSize: 20,
            page: 0
          }}
          onToggleSelectedRow={(ids) => { console.info(ids); }}
          onRowDelete={(id) => { console.info(id); }}
        />
      </div>
    );
  }
}

DatasetTable.defaultProps = {
  application: ['rw'],
  columns: [],
  actions: {}
};

DatasetTable.propTypes = {
  application: React.PropTypes.array.isRequired,
  authorization: React.PropTypes.string
};

export default DatasetTable;
