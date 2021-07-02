import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { toastr } from 'react-redux-toastr';

// services
import { fetchDatasets } from 'services/dataset';

// components
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';
import SearchInput from 'components/ui/SearchInput';
import TableFilters from 'components/admin/table-filters';
import NameTD from './td/name';
import CodeTD from './td/code';
import StatusTD from './td/status';
import PublishedTD from './td/published';
import OwnerTD from './td/owner';
import RoleTD from './td/role';
import ApplicationsTD from './td/applications';
import UpdatedAtTD from './td/updated-at';
import RelatedContentTD from './td/related-content';
import EditAction from './actions/edit';
import DeleteAction from './actions/delete';

// constants
import { INITIAL_PAGINATION } from './constants';

class DatasetsTable extends PureComponent {
  static propTypes = { user: PropTypes.object.isRequired }

  state = {
    pagination: INITIAL_PAGINATION,
    loading: true,
    datasets: [],
    filters: { name: null, 'user.role': 'ADMIN' },
  };

  componentDidMount() {
    this.loadDatasets();
  }

  onFiltersChange = (value) => {
    this.setState({
      filters: {
        ...this.state.filters,
        'user.role': value.value,
      },
    },
    () => this.loadDatasets());
  }

  /**
   * Event handler executed when the user search for a dataset
   * @param {string} { value } Search keywords
   */
  onSearch = debounce((value) => {
    const { filters } = this.state;

    if (value.length > 0 && value.length < 3) return;

    this.setState({
      loading: true,
      filters: {
        ...filters,
        name: value,
      },
      pagination: INITIAL_PAGINATION,
    }, () => this.loadDatasets());
  }, 250)

  onChangePage = (nextPage) => {
    const { pagination } = this.state;

    this.setState({
      loading: true,
      pagination: {
        ...pagination,
        page: nextPage,
      },
    }, () => this.loadDatasets());
  }

  onRemoveDataset = () => {
    this.setState({ loading: true });
    this.loadDatasets();
  }

  loadDatasets = () => {
    const { user } = this.props;
    const { pagination, filters } = this.state;

    this.setState({ loading: true });

    fetchDatasets({
      includes: 'widget,layer,metadata,user',
      'page[number]': pagination.page,
      'page[size]': pagination.limit,
      application: process.env.NEXT_PUBLIC_APPLICATIONS,
      ...filters,
    }, { Authorization: user?.token }, true)
      .then(({ datasets, meta }) => {
        const {
          'total-pages': pages,
          'total-items': size,
        } = meta;
        const nextPagination = {
          ...pagination,
          size,
          pages,
        };

        this.setState({
          loading: false,
          pagination: nextPagination,
          datasets: datasets.map((_dataset) => ({
            ..._dataset,
            owner: _dataset.user ? _dataset.user.name || (_dataset.user.email || '').split('@')[0] : '',
            role: _dataset.user ? _dataset.user.role : '',
          })),
        });
      })
      .catch((error) => toastr.error('There was an error loading the datasets', error));
  }

  render() {
    const {
      loading,
      pagination,
      datasets,
    } = this.state;

    return (
      <div className="c-dataset-table">
        <Spinner
          className="-light"
          isLoading={loading}
        />

        <TableFilters
          filtersChange={this.onFiltersChange}
        />

        <SearchInput
          input={{ placeholder: 'Search dataset' }}
          link={{
            label: 'New dataset',
            route: '/admin/data/datasets/new',
            // params: { tab: 'datasets', id: 'new' },
          }}
          onSearch={this.onSearch}
        />
        <CustomTable
          columns={[
            {
              label: 'Name', value: 'name', td: NameTD,
            },
            { label: 'Code', value: 'code', td: CodeTD },
            { label: 'Status', value: 'status', td: StatusTD },
            { label: 'Published', value: 'published', td: PublishedTD },
            { label: 'Provider', value: 'provider' },
            { label: 'Owner', value: 'owner', td: OwnerTD },
            { label: 'Role', value: 'role', td: RoleTD },
            { label: 'Updated at', value: 'updatedAt', td: UpdatedAtTD },
            { label: 'Applications', value: 'application', td: ApplicationsTD },
            {
              label: 'Related content', value: 'status', td: RelatedContentTD, tdProps: { route: '/admin/data' },
            },
          ]}
          actions={{
            show: true,
            list: [
              {
                name: 'Edit', params: { tab: 'datasets', subtab: 'edit', id: '{{id}}' }, show: true, component: EditAction,
              },
              {
                name: 'Remove', params: { tab: 'datasets', subtab: 'remove', id: '{{id}}' }, component: DeleteAction,
              },
            ],
          }}
          sort={{
            field: 'updatedAt',
            value: -1,
          }}
          filters={false}
          data={datasets}
          onRowDelete={this.onRemoveDataset}
          onChangePage={this.onChangePage}
          pagination={pagination}
        />
      </div>
    );
  }
}

export default DatasetsTable;
