import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { getDatasets, setFilters } from 'redactions/admin/datasets';

// Selectors
import getFilteredDatasets from 'selectors/admin/datasets';

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
  static defaultProps = {
    routes: {
      index: '',
      detail: ''
    },
    columns: [],
    actions: {},
    getDatasetsFilters: {},
    // Store
    datasets: []
  };

  static propTypes = {
    routes: PropTypes.object,
    getDatasetsFilters: PropTypes.object,

    // Store
    user: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    datasets: PropTypes.array.isRequired,
    error: PropTypes.string,

    // Actions
    getDatasets: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired
  };


  constructor(props) {
    super(props);

    this.onSearch = this.onSearch.bind(this);
  }

  componentDidMount() {
    this.props.setFilters({});
    this.props.getDatasets({ includes: 'widget,layer,metadata,vocabulary,user' });
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

  getDatasets() {
    return this.props.datasets
      .map((d) => {
        const user = d.user || {};

        const metadata = d.metadata.length && d.metadata.length > 0 && d.metadata[0];
        const metadataInfo = (metadata && metadata.attributes) && (metadata.attributes.info || {});

        return {
          ...d,
          owner: user.email || '',
          role: user.role || '',
          code: metadataInfo.rwId || ''
        };
      });
  }

  render() {
    const { routes, getDatasetsFilters } = this.props;

    return (
      <div className="c-dataset-table">
        <Spinner className="-light" isLoading={this.props.loading} />

        {this.props.error && (
          <p>Error: {this.props.error}</p>
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
              { label: 'Owner', value: 'owner', td: OwnerTD },
              { label: 'Updated at', value: 'updatedAt', td: UpdatedAtTD },
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
            data={this.getDatasets()}
            onRowDelete={() => this.props.getDatasets({
              includes: 'widget,layer,metadata,vocabulary,user',
              filters: getDatasetsFilters
            })}
            pageSize={20}
            pagination={{
              enabled: true,
              pageSize: 20,
              page: 0
            }}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  loading: state.datasets.datasets.loading,
  datasets: getFilteredDatasets(state),
  error: state.datasets.datasets.error
});
const mapDispatchToProps = {
  getDatasets,
  setFilters
};

export default connect(mapStateToProps, mapDispatchToProps)(DatasetsTable);
