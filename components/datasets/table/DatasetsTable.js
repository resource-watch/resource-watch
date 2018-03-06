import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { setFilters } from 'redactions/admin/datasets';

import { changeDatasetPage } from 'pages/admin/data/data-actions';

// Components
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';
import SearchInput from 'components/ui/SearchInput';

// Table components
import EditAction from './actions/EditAction';
import DeleteAction from './actions/DeleteAction';

// TDs
import NameTD from './td/NameTD';
import PublishedTD from './td/PublishedTD';
import StatusTD from './td/StatusTD';
import RelatedContentTD from './td/RelatedContentTD';
import UpdatedAtTD from './td/UpdatedAtTD';
import OwnerTD from './td/OwnerTD';

class DatasetsTable extends React.Component {
  constructor(props) {
    super(props);

    this.onSearch = this.onSearch.bind(this);
  }

  componentDidMount() {
    this.props.setFilters({});
  }

  /**
   * Event handler executed when the user search for a dataset
   * @param {string} { value } Search keywords
   */
  onSearch(value) {
    if (!value.length) {
      this.props.setFilters([]);
    } else {
      this.props.setFilters([{ key: 'name', value }]);
    }
  }

  getFilteredDatasets() {
    const { adminDataPage } = this.props;
    const { datasets } = adminDataPage;

    return datasets.list
      .map((d) => {
        const user = d.user || {};

        const metadata = d.metadata.length && d.metadata.length > 0 && d.metadata[0];
        const metadataInfo = (metadata && metadata.attributes) && (metadata.attributes.info || {});

        return {
          ...d,
          owner: user.email || '',
          code: metadataInfo.rwId || ''
        };
      })
      .filter(d => d && (d.published === true || d.user.role === 'ADMIN'));
  }

  render() {
    const {
      routes,
      error,
      adminDataPage
    } = this.props;

    return (
      <div className="c-dataset-table">
        <Spinner className="-light" isLoading={adminDataPage.loading} />

        {error && (
          <p>Error: {error}</p>
        )}

        <SearchInput
          input={{
            placeholder: 'Search dataset'
          }}
          link={{
            label: 'New dataset',
            route: routes.detail,
            params: { tab: 'datasets', id: 'new' }
          }}
          onSearch={this.onSearch}
        />


        {!this.props.error && (
          <CustomTable
            columns={[
              { label: 'Name', value: 'name', td: NameTD, tdProps: { route: routes.detail } },
              { label: 'Code', value: 'code' },
              { label: 'Status', value: 'status', td: StatusTD },
              { label: 'Published', value: 'published', td: PublishedTD },
              { label: 'Provider', value: 'provider' },
              { label: 'Updated at', value: 'updatedAt', td: UpdatedAtTD },
              { label: 'Owner', value: 'owner', td: OwnerTD },
              { label: 'Related content', value: 'status', td: RelatedContentTD, tdProps: { route: routes.detail } }
            ]}
            actions={{
              show: true,
              list: [
                { name: 'Edit', route: routes.detail, params: { tab: 'datasets', subtab: 'edit', id: '{{id}}' }, show: true, component: EditAction, componentProps: { route: routes.detail } },
                { name: 'Remove', route: routes.detail, params: { tab: 'datasets', subtab: 'remove', id: '{{id}}' }, component: DeleteAction, componentProps: { authorization: this.props.user.token } }
              ]
            }}
            sort={{
              field: 'updatedAt',
              value: -1
            }}
            filters={false}
            data={this.getFilteredDatasets()}
            onRowDelete={() => this.props.changeDatasetPage()}
            pageSize={20}
            onChangePage={page => this.props.changeDatasetPage(page)}
            pagination={{
              enabled: true,
              dynamic: true,
              pageSize: 20,
              items: adminDataPage.datasets.pagination.total,
              page: adminDataPage.datasets.activePage - 1
            }}
          />
        )}
      </div>
    );
  }
}

DatasetsTable.defaultProps = {
  routes: {
    index: '',
    detail: ''
  }
};

DatasetsTable.propTypes = {
  routes: PropTypes.object,

  // Store
  user: PropTypes.object,
  adminDataPage: PropTypes.object.isRequired,
  error: PropTypes.string,

  // Actions
  changeDatasetPage: PropTypes.func,
  setFilters: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  loading: state.datasets.datasets.loading,
  datasets: state.datasets.datasets,
  adminDataPage: state.adminDataPage,
  error: state.datasets.datasets.error
});

const mapDispatchToProps = {
  setFilters,
  changeDatasetPage
};

export default connect(mapStateToProps, mapDispatchToProps)(DatasetsTable);
