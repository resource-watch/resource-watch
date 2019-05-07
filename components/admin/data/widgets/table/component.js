import React from 'react';
import PropTypes from 'prop-types';

// utils
import debounce from 'lodash/debounce';

// constants
import { INITIAL_PAGINATION } from 'components/datasets/table/constants';

// services
import { fetchWidgets } from 'services/widget';

// Components
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';
import SearchInput from 'components/ui/SearchInput';

// Table components
import EditAction from './actions/EditAction';
import DeleteAction from './actions/DeleteAction';

// TDs
import TitleTD from './td/TitleTD';
import PublishedTD from './td/PublishedTD';
import OwnerTD from './td/OwnerTD';

class WidgetsTable extends React.Component {
  static propTypes = { dataset: PropTypes.string };

  static defaultProps = { dataset: '' };

  state = {
    pagination: INITIAL_PAGINATION,
    loading: true,
    widgets: [],
    filters: { name: null }
  }

  componentDidMount() {
    const { pagination } = this.state;

    fetchWidgets({
      includes: 'widget,layer,metadata,vocabulary,user',
      'page[number]': pagination.page,
      'page[size]': pagination.limit,
      ...this.props.dataset && { dataset: this.props.dataset }
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
        includes: 'widget,layer,metadata,vocabulary,user',
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
    const { pagination } = this.state;

    this.setState({ loading: true });
    fetchWidgets({
      includes: 'widget,layer,metadata,vocabulary,user',
      'page[number]': pagination.page,
      'page[size]': pagination.limit,
      ...this.props.dataset && { dataset: this.props.dataset }
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

    const { dataset } = this.props;

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
              { label: 'Title', value: 'name', td: TitleTD, tdProps: { dataset } },
              { label: 'Published', value: 'published', td: PublishedTD },
              { label: 'Owner', value: 'owner', td: OwnerTD }
            ]}
            actions={{
              show: true,
              list: [
                { name: 'Edit', route: 'admin_data_detail', params: { tab: 'widgets', subtab: 'edit', id: '{{id}}', ...!!dataset && { dataset } }, show: true, component: EditAction },
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
