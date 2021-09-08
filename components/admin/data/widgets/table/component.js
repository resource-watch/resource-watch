import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import cx from 'classnames';

// services
import { fetchWidgets } from 'services/widget';
import { fetchDataset } from 'services/dataset';

// components
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';
import SearchInput from 'components/ui/SearchInput';
import TableFilters from 'components/admin/table-filters';

// TDs
import TitleTD from './td/title';
import PublishedTD from './td/published';
import OwnerTD from './td/owner';
import RoleTD from './td/role';

// actions
import EditAction from './actions/edit';
import DeleteAction from './actions/delete';

// constants
import { INITIAL_PAGINATION } from './constants';

class WidgetsTable extends PureComponent {
  state = {
    pagination: INITIAL_PAGINATION,
    loading: true,
    dataset: null,
    widgets: [],
    filters: { name: null, 'user.role': 'ADMIN' },
  }

  componentDidMount() {
    this.loadWidgets();
    this.loadDataset();
  }

  onFiltersChange = (value) => {
    const { filters } = this.state;
    this.setState({
      filters: {
        name: filters.name,
        'user.role': value.value,
      },
    },
      () => this.loadWidgets());
  }

  /**
   * Event handler executed when the user search for a widget
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
    }, () => this.loadWidgets());
  }, 250);

  loadDataset = () => {
    const { dataset } = this.props;
    fetchDataset(dataset)
      .then((d) => {
        this.setState({ dataset: d });
      })
      .catch((error) => { this.setState({ error }); });
  }

  onChangePage = (nextPage) => {
    const { pagination } = this.state;

    this.setState({
      loading: true,
      pagination: {
        ...pagination,
        page: nextPage,
      },
    }, () => this.loadWidgets());
  }

  onRemoveWidget = () => {
    this.setState({ loading: true });
    this.loadWidgets();
  }

  loadWidgets = () => {
    const { dataset, token } = this.props;
    const { pagination, filters } = this.state;

    this.setState({ loading: true });

    fetchWidgets({
      includes: 'user',
      'page[number]': pagination.page,
      'page[size]': pagination.limit,
      application: process.env.NEXT_PUBLIC_APPLICATIONS,
      ...dataset && { dataset },
      ...filters,
    }, { Authorization: `Bearer ${token}` }, true)
      .then(({ widgets, meta }) => {
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
          widgets: widgets.map((_widget) => ({
            ..._widget,
            owner: _widget.user ? _widget.user.name || (_widget.user.email || '').split('@')[0] : '',
            role: _widget.user ? _widget.user.role || '' : '',
          })),
        });
      })
      .catch((error) => { this.setState({ error }); });
  }

  render() {
    const {
      loading,
      pagination,
      widgets,
      error,
      dataset,
    } = this.state;
    const { dataset: datasetID } = this.props;

    const disabled = !dataset || !process.env.NEXT_PUBLIC_ENVS_EDIT.includes(dataset.env);

    return (
      <div className="c-widgets-table">
        <Spinner className="-light" isLoading={loading} />

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
          input={{ placeholder: 'Search widget' }}
          link={{
            label: 'New widget',
            route: `/admin/data/widgets/new?dataset=${datasetID}`,
          }}
          onSearch={this.onSearch}
          disableButton={disabled}
        />

        {!error && (
          <CustomTable
            columns={[
              { label: 'Title', value: 'name', td: TitleTD },
              { label: 'Published', value: 'published', td: PublishedTD },
              { label: 'Owner', value: 'owner', td: OwnerTD },
              { label: 'Role', value: 'role', td: RoleTD },
              { label: 'Environment', value: 'env' },
            ]}
            actions={{
              show: true,
              list: [
                {
                  name: 'Edit',
                  params: {
                    tab: 'widgets', subtab: 'edit', id: '{{id}}', datasetID,
                  },
                  show: true,
                  component: EditAction,
                },
                {
                  name: 'Remove', params: { tab: 'widgets', subtab: 'remove', id: '{{id}}' }, component: DeleteAction,
                },
              ],
            }}
            sort={{
              field: 'name',
              value: 1,
            }}
            filters={false}
            data={widgets}
            onChangePage={this.onChangePage}
            pagination={pagination}
            onRowDelete={this.onRemoveWidget}
          />
        )}
      </div>
    );
  }
}

WidgetsTable.defaultProps = {
  dataset: null,
};

WidgetsTable.propTypes = {
  token: PropTypes.string.isRequired,
  dataset: PropTypes.string,
};

export default WidgetsTable;
