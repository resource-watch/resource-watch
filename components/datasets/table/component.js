import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// utils
import debounce from 'lodash/debounce';

// services
import { fetchDatasets } from 'services/dataset';

// components
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';
import SearchInput from 'components/ui/SearchInput';
import EditAction from './actions/EditAction';
import DeleteAction from './actions/DeleteAction';
import NameTD from './td/NameTD';
import PublishedTD from './td/PublishedTD';
import StatusTD from './td/StatusTD';
import RelatedContentTD from './td/RelatedContentTD';
import UpdatedAtTD from './td/UpdatedAtTD';
import OwnerTD from './td/OwnerTD';

// constants
import { INITIAL_PAGINATION } from './constants';

class DatasetsTable extends PureComponent {
  static propTypes = { user: PropTypes.object.isRequired };

  state = {
    pagination: INITIAL_PAGINATION,
    loading: true,
    datasets: [],
    filters: { name: null }
  }

  componentDidMount() {
    const { pagination } = this.state;

    fetchDatasets({
      includes: 'widget,layer,metadata,vocabulary,user',
      'page[number]': pagination.page,
      'page[size]': pagination.limit
    }, true)
      .then(({ datasets, meta }) => {
        const {
          'total-pages': pages,
          'total-items': size
        } = meta;
        const nextPagination = {
          ...pagination,
          size,
          pages
        };

        this.setState({
          loading: false,
          pagination: nextPagination,
          datasets
        });
      })
      .catch((error) => { this.setState({ error }); });
  }

  /**
   * Event handler executed when the user search for a dataset
   * @param {string} { value } Search keywords
   */
  onSearch = debounce((value) => {
    const { pagination, filters } = this.state;

    if (value.length > 0 && value.length < 3) return;

    this.setState({
      loading: true,
      filters: {
        ...filters,
        name: value
      }
    }, () => {
      const params = {
        includes: 'widget,layer,metadata,vocabulary,user',
        ...!value.length && {
          'page[number]': INITIAL_PAGINATION.page,
          'page[size]': INITIAL_PAGINATION.limit
        },
        ...value.length > 2 && {
          'page[number]': INITIAL_PAGINATION.page,
          'page[size]': INITIAL_PAGINATION.limit,
          sort: 'name',
          name: value
        }
      };

      fetchDatasets(params, true)
        .then(({ datasets, meta }) => {
          const {
            'total-pages': pages,
            'total-items': size
          } = meta;
          const nextPagination = {
            ...pagination,
            size,
            pages,
            page: INITIAL_PAGINATION.page
          };


          this.setState({
            loading: false,
            pagination: nextPagination,
            datasets
          });
        })
        .catch((error) => { this.setState({ error }); });
    });
  }, 250)

  onChangePage = (nextPage) => {
    const { pagination, filters } = this.state;

    this.setState({
      loading: true,
      pagination: {
        ...pagination,
        page: nextPage
      }
    }, () => {
      const { pagination: { page } } = this.state;

      fetchDatasets({
        includes: 'widget,layer,metadata,vocabulary,user',
        'page[number]': page,
        'page[size]': pagination.limit,
        ...filters
      })
        .then((datasets) => {
          this.setState({
            loading: false,
            datasets
          });
        })
        .catch((error) => { this.setState({ error }); });
    });
  }

  onRemoveDataset = () => {
    const { pagination } = this.state;

    this.setState({ loading: true });

    fetchDatasets({
      includes: 'widget,layer,metadata,vocabulary,user',
      'page[number]': pagination.page,
      'page[size]': pagination.limit
    }, true)
      .then(({ datasets, meta }) => {
        const {
          'total-pages': pages,
          'total-items': size
        } = meta;
        const nextPagination = {
          ...pagination,
          size,
          pages
        };

        this.setState({
          loading: false,
          pagination: nextPagination,
          datasets
        });
      })
      .catch((error) => { this.setState({ error }); });
  }

  render() {
    const {
      loading,
      pagination,
      datasets,
      error
    } = this.state;

    return (
      <div className="c-dataset-table">
        <Spinner
          className="-light"
          isLoading={loading}
        />

        {error && (
          <p>Error: {error}</p>
        )}

        <SearchInput
          input={{ placeholder: 'Search dataset' }}
          link={{
            label: 'New dataset',
            route: 'admin_data_detail',
            params: { tab: 'datasets', id: 'new' }
          }}
          onSearch={this.onSearch}
        />
        {!error && (
          <CustomTable
            columns={[
              { label: 'Name', value: 'name', td: NameTD, tdProps: { route: 'admin_data_detail' } },
              { label: 'Code', value: 'code' },
              { label: 'Status', value: 'status', td: StatusTD },
              { label: 'Published', value: 'published', td: PublishedTD },
              { label: 'Provider', value: 'provider' },
              { label: 'Owner', value: 'owner', td: OwnerTD },
              { label: 'Updated at', value: 'updatedAt', td: UpdatedAtTD },
              { label: 'Related content', value: 'status', td: RelatedContentTD, tdProps: { route: 'admin_data_detail' } }
            ]}
            actions={{
              show: true,
              list: [
                { name: 'Edit', route: 'admin_data_detail', params: { tab: 'datasets', subtab: 'edit', id: '{{id}}' }, show: true, component: EditAction, componentProps: { route: 'admin_data_detail' } },
                { name: 'Remove', route: 'admin_data_detail', params: { tab: 'datasets', subtab: 'remove', id: '{{id}}' }, component: DeleteAction, componentProps: { authorization: this.props.user.token } }
              ]
            }}
            sort={{
              field: 'updatedAt',
              value: -1
            }}
            filters={false}
            data={datasets}
            onRowDelete={this.onRemoveDataset}
            onChangePage={this.onChangePage}
            pagination={pagination}
          />
        )}
      </div>
    );
  }
}

export default DatasetsTable;
