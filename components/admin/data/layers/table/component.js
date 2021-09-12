import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import cx from 'classnames';

// services
import { fetchLayers } from 'services/layer';
import { fetchDataset } from 'services/dataset';

// components
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';
import SearchInput from 'components/ui/SearchInput';
import TableFilters from 'components/admin/table-filters';

// TDs
import NameTD from './td/name';
import OwnerTD from './td/owner';
import RoleTD from './td/role';
import UpdatedAtTD from './td/updated-at';

// actions
import EditAction from './actions/edit';
import DeleteAction from './actions/delete';
import GoToDatasetAction from './actions/go-to-dataset';

// constants
import { INITIAL_PAGINATION } from './constants';

class LayersTable extends PureComponent {
  state = {
    pagination: INITIAL_PAGINATION,
    loading: true,
    dataset: null,
    layers: [],
    filters: { name: null, 'user.role': 'ADMIN' },
  }

  UNSAFE_componentWillMount() {
    const { dataset } = this.props;
    this.loadLayers();
    if (dataset) {
      this.loadDataset();
    }
  }

  onFiltersChange = (value) => {
    this.setState({
      filters: {
        ...this.state.filters,
        'user.role': value.value,
      },
    },
    () => this.loadLayers());
  }

  /**
   * Event handler executed when the user search for a layer
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
    }, () => this.loadLayers());
  }, 250);

  loadDataset = () => {
    const { dataset } = this.props;
    fetchDataset(dataset)
      .then((d) => {
        this.setState({ dataset: d });
      })
      .catch((error) => { this.setState({ error }); });
  };

  onChangePage = (nextPage) => {
    const { pagination } = this.state;

    this.setState({
      loading: true,
      pagination: {
        ...pagination,
        page: nextPage,
      },
    }, () => this.loadLayers());
  }

  onRemoveLayer = () => {
    this.setState({ loading: true });
    this.loadLayers();
  }

  loadLayers = () => {
    const { dataset, token } = this.props;
    const { pagination, filters } = this.state;

    this.setState({ loading: true });

    fetchLayers({
      includes: 'user',
      'page[number]': pagination.page,
      'page[size]': pagination.limit,
      application: process.env.NEXT_PUBLIC_APPLICATIONS,
      ...(dataset && { dataset }),
      ...filters,
      env: process.env.NEXT_PUBLIC_ENVS_SHOW,
    }, { Authorization: `Bearer ${token}` }, true)
      .then(({ layers, meta }) => {
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
          layers: layers.map((_layer) => ({
            ..._layer,
            owner: _layer.user ? _layer.user.name || (_layer.user.email || '').split('@')[0] : '',
            role: _layer.user ? _layer.user.role || '' : '',
            disabled: !process.env.NEXT_PUBLIC_ENVS_EDIT.includes(_layer.env),
          })),
        });
      })
      .catch(({ message }) => { this.setState({ error: message }); });
  }

  render() {
    const {
      loading,
      pagination,
      layers,
      error,
      dataset,
    } = this.state;
    const { dataset: datasetID } = this.props;

    const disableNewButton = dataset && !process.env.NEXT_PUBLIC_ENVS_EDIT.includes(dataset.env);

    return (
      <div className="c-layer-table">
        <Spinner
          className="-light"
          isLoading={loading}
        />

        {error && (
          <p>
            Error:
            {error}
          </p>
        )}

        <TableFilters
          filtersChange={this.onFiltersChange}
        />

        <SearchInput
          input={{ placeholder: 'Search layer' }}
          link={{
            label: 'New layer',
            route: `/admin/data/layers/new?dataset=${datasetID}`,
          }}
          onSearch={this.onSearch}
          disableButton={disableNewButton}
        />

        {!error && (
          <CustomTable
            columns={[
              { label: 'Name', value: 'name', td: NameTD },
              { label: 'Provider', value: 'provider' },
              { label: 'Owner', value: 'owner', td: OwnerTD },
              { label: 'Role', value: 'role', td: RoleTD },
              { label: 'Updated at', value: 'updatedAt', td: UpdatedAtTD },
              { label: 'Environment', value: 'env' },
            ]}
            actions={{
              show: true,
              list: [
                {
                  name: 'Edit',
                  route: '/admin/data/layers/{{id}}/edit',
                  params: {
                    tab: 'layers', subtab: 'edit', id: '{{id}}', datasetID,
                  },
                  show: true,
                  component: EditAction,
                },
                {
                  name: 'Remove', route: '/admin/data/layers/{{id}}/remove', params: { tab: 'layers', subtab: 'remove', id: '{{id}}' }, component: DeleteAction,
                },
                {
                  name: 'Go to dataset', route: '/admin/data/:tab/:id/:subtab', params: { tab: 'datasets', subtab: 'edit', id: '{{id}}' }, component: GoToDatasetAction,
                },
              ],
            }}
            sort={{
              field: 'updatedAt',
              value: -1,
            }}
            filters={false}
            data={layers}
            onRowDelete={this.onRemoveLayer}
            onChangePage={this.onChangePage}
            pagination={pagination}
          />
        )}
      </div>
    );
  }
}

LayersTable.defaultProps = {
  dataset: null,
};

LayersTable.propTypes = {
  dataset: PropTypes.string,
  token: PropTypes.string.isRequired,
};

export default LayersTable;
