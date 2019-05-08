import React from 'react';

// utils
import debounce from 'lodash/debounce';

// constants
import { INITIAL_PAGINATION } from 'components/datasets/table/constants';

// services
import { fetchWidgets } from 'services/widget';

// components
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';
import SearchInput from 'components/ui/SearchInput';
import TitleTD from './td/title';
import PublishedTD from './td/published';
import OwnerTD from './td/owner';
import EditAction from './actions/edit';
import DeleteAction from './actions/delete';

class WidgetsTable extends React.Component {
  state = {
    pagination: INITIAL_PAGINATION,
    loading: true,
    widgets: [],
    filters: { name: null }
  }

  componentDidMount() {
    const { pagination } = this.state;

    fetchWidgets({
      includes: 'user',
      'page[number]': pagination.page,
      'page[size]': pagination.limit
    }, true)
      .then(({ widgets, meta }) => {
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
          widgets
        });
      })
      .catch((error) => { this.setState({ error }); });
  }

  /**
   * Event handler executed when the user search for a widget
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
        includes: 'user',
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
      fetchWidgets(params, true)
        .then(({ widgets, meta }) => {
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
            widgets
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

      fetchWidgets({
        includes: 'user',
        'page[number]': page,
        'page[size]': pagination.limit,
        ...filters
      })
        .then((widgets) => {
          this.setState({
            loading: false,
            widgets
          });
        })
        .catch((error) => { this.setState({ error }); });
    });
  }

  onRemoveWidget = () => {
    const { pagination, filters } = this.state;

    this.setState({ loading: true });
    fetchWidgets({
      includes: 'user',
      'page[number]': pagination.page,
      'page[size]': pagination.limit,
      ...filters
    }, true)
      .then(({ widgets, meta }) => {
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
          widgets
        });
      })
      .catch((error) => { this.setState({ error }); });
  }

  render() {
    const {
      loading,
      pagination,
      widgets,
      error
    } = this.state;

    return (
      <div className="c-widgets-table">
        <Spinner className="-light" isLoading={loading} />

        {error && (
          <p>Error: {error}</p>
        )}

        <SearchInput
          input={{ placeholder: 'Search widget' }}
          link={{
            label: 'New widget',
            route: 'admin_data_detail',
            params: {
              tab: 'widgets',
              id: 'new'
            }
          }}
          onSearch={this.onSearch}
        />

        {!error && (
          <CustomTable
            columns={[
              { label: 'Title', value: 'name', td: TitleTD },
              { label: 'Published', value: 'published', td: PublishedTD },
              { label: 'Owner', value: 'owner', td: OwnerTD }
            ]}
            actions={{
              show: true,
              list: [
                { name: 'Edit', route: 'admin_data_detail', params: { tab: 'widgets', subtab: 'edit', id: '{{id}}' }, show: true, component: EditAction },
                { name: 'Remove', route: 'admin_data_detail', params: { tab: 'widgets', subtab: 'remove', id: '{{id}}' }, component: DeleteAction, componentProps: { authorization: this.props.authorization } }
              ]
            }}
            sort={{
              field: 'name',
              value: 1
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

export default WidgetsTable;
