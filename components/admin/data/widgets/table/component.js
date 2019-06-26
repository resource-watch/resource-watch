import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

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

// constants
import { INITIAL_PAGINATION } from './constants';

class WidgetsTable extends PureComponent {
  static propTypes = {
    dataset: PropTypes.string,
    user: PropTypes.object.isRequired
  }

  static defaultProps = { dataset: null }

  state = {
    pagination: INITIAL_PAGINATION,
    loading: true,
    widgets: [],
    filters: { name: null }
  }

  componentDidMount() {
    const { dataset, user: { token } } = this.props;
    const { pagination } = this.state;

    fetchWidgets({
      includes: 'user',
      'page[number]': pagination.page,
      'page[size]': pagination.limit,
      application: process.env.APPLICATIONS,
      ...dataset && { dataset }
    }, { Authorization: token }, true)
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
          widgets: widgets.map(_widget => ({
            ..._widget,
            owner: _widget.user ? _widget.user.name || (_widget.user.email || '').split('@')[0] : ''
          }))
        });
      })
      .catch((error) => { this.setState({ error }); });
  }

  /**
   * Event handler executed when the user search for a widget
   * @param {string} { value } Search keywords
   */
  onSearch = debounce((value) => {
    const { dataset, user: { token } } = this.props;
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
          'page[size]': INITIAL_PAGINATION.limit,
          application: process.env.APPLICATIONS,
          ...dataset && { dataset }
        },
        ...value.length > 2 && {
          'page[number]': INITIAL_PAGINATION.page,
          'page[size]': INITIAL_PAGINATION.limit,
          application: process.env.APPLICATIONS,
          sort: 'name',
          name: value,
          ...dataset && { dataset }
        }
      };

      fetchWidgets(params, { Authorization: token }, true)
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
            widgets: widgets.map(_widget => ({
              ..._widget,
              owner: _widget.user ? _widget.user.name || (_widget.user.email || '').split('@')[0] : ''
            }))
          });
        })
        .catch(({ message }) => { this.setState({ error: message }); });
    });
  }, 250)

  onChangePage = (nextPage) => {
    const { dataset, user: { token } } = this.props;
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
        application: process.env.APPLICATIONS,
        ...filters,
        ...dataset && { dataset }
      }, { Authorization: token })
        .then((widgets) => {
          this.setState({
            loading: false,
            widgets: widgets.map(_widget => ({
              ..._widget,
              owner: _widget.user ? _widget.user.name || (_widget.user.email || '').split('@')[0] : ''
            }))
          });
        })
        .catch(({ message }) => { this.setState({ error: message }); });
    });
  }

  onRemoveWidget = () => {
    const { dataset, user: { token } } = this.props;
    const { pagination, filters } = this.state;

    this.setState({ loading: true });

    fetchWidgets({
      includes: 'user',
      'page[number]': pagination.page,
      'page[size]': pagination.limit,
      application: process.env.APPLICATIONS,
      ...filters,
      ...dataset && { dataset }
    }, { Authorization: token }, true)
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
          widgets: widgets.map(_widget => ({
            ..._widget,
            owner: _widget.user ? _widget.user.name || (_widget.user.email || '').split('@')[0] : ''
          }))
        });
      })
      .catch(({ message }) => { this.setState({ error: message }); });
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
              id: 'new',
              dataset
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
                { name: 'Remove', route: 'admin_data_detail', params: { tab: 'widgets', subtab: 'remove', id: '{{id}}' }, component: DeleteAction }
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
