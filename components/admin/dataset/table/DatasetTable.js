import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getDatasets } from 'redactions/admin/datasets';

// Components
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';

// Table components
import EditAction from './actions/EditAction';
import DeleteAction from './actions/DeleteAction';

// TDs
import NameTD from './td/NameTD';
import StatusTD from './td/StatusTD';
import RelatedContentTD from './td/RelatedContentTD';

class DatasetTable extends React.Component {

  componentDidMount() {
    this.props.getDatasets(this.props.application);
  }

  getDatasets() {
    return this.props.datasets
      .map(dataset => Object.assign({}, dataset.attributes, { id: dataset.id }));
  }

  render() {
    return (
      <div className="c-dataset-table">
        <Spinner className="-light" isLoading={this.props.loading} />

        { this.props.error && (
          <p>Error: {this.props.error}</p>
        ) }

        { !this.props.error && (
          <CustomTable
            columns={[
              { label: 'Name', value: 'name', td: NameTD },
              { label: 'Status', value: 'status', td: StatusTD },
              { label: 'Provider', value: 'provider' },
              { label: 'Related content', value: 'status', td: RelatedContentTD }
            ]}
            actions={{
              show: true,
              list: [
                { name: 'Edit', route: 'admin_data_detail', params: { tab: 'datasets', subtab: 'edit', id: '{{id}}' }, show: true, component: EditAction },
                { name: 'Remove', route: 'admin_data_detail', params: { tab: 'datasets', subtab: 'remove', id: '{{id}}' }, component: DeleteAction, componentProps: { authorization: this.props.authorization } }
              ]
            }}
            filters={false}
            data={this.getDatasets()}
            pageSize={20}
            pagination={{
              enabled: true,
              pageSize: 20,
              page: 0
            }}
            onToggleSelectedRow={(ids) => { console.info(ids); }}
            onRowDelete={(id) => { console.info(id); }}
          />
        ) }
      </div>
    );
  }
}

DatasetTable.defaultProps = {
  application: ['rw'],
  columns: [],
  actions: {},
  // Store
  datasets: []
};

DatasetTable.propTypes = {
  application: PropTypes.array.isRequired,
  authorization: PropTypes.string,
  // Store
  loading: PropTypes.bool.isRequired,
  datasets: PropTypes.array.isRequired,
  error: PropTypes.string,
  getDatasets: PropTypes.func.isRequired
};

const mapStateToProps = ({ datasets }) => ({
  loading: datasets.datasets.loading,
  datasets: datasets.datasets.list,
  error: datasets.datasets.error
});
const mapDispatchToProps = dispatch => ({
  getDatasets: () => dispatch(getDatasets())
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(DatasetTable);
