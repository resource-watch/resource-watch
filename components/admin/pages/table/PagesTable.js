import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

import { getPages, setFilters } from 'redactions/admin/pages';

// Selectors
import getFilteredPages from 'selectors/admin/pages';

// Components
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';
import SearchInput from 'components/ui/SearchInput';

// constants
import { INITIAL_PAGINATION } from 'components/datasets/table/constants';

// Table components
import EditAction from './actions/EditAction';
import DeleteAction from './actions/DeleteAction';

// TDs
import TitleTD from './td/TitleTD';
import PublishedTD from './td/PublishedTD';

class PagesTable extends PureComponent {
  static defaultProps = {
    columns: [],
    actions: {},
    // Store
    pages: [],
    filteredPages: []
  };

  static propTypes = {
    authorization: PropTypes.string,
    // Store
    loading: PropTypes.bool.isRequired,
    pages: PropTypes.array.isRequired,
    filteredPages: PropTypes.array.isRequired,
    error: PropTypes.string,

    // Actions
    getPages: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired
  };

  state = { pagination: INITIAL_PAGINATION }

  componentDidMount() {
    this.props.setFilters([]);
    this.props.getPages();
  }

  /**
   * Event handler executed when the user search for a dataset
   * @param {string} { value } Search keywords
   */
  onSearch = (value) => {
    if (!value.length) {
      this.props.setFilters([]);
    } else {
      this.props.setFilters([{ key: 'name', value }]);
    }
  }

  /**
   * HELPERS
   * - getPages
   * - getFilteredPages
  */
  getPages() {
    return this.props.pages;
  }

  getFilteredPages() {
    return this.props.filteredPages;
  }

  render() {
    const { pagination } = this.state;
    return (
      <div className="c-pages-table">
        <Spinner className="-light" isLoading={this.props.loading} />

        {this.props.error && (
          <p>Error: {this.props.error}</p>
        )}

        <SearchInput
          input={{ placeholder: 'Search page' }}
          link={{
            label: 'New page',
            route: 'admin_pages_detail',
            params: { tab: 'pages', id: 'new' }
          }}
          onSearch={this.onSearch}
        />

        {!this.props.error && (
          <CustomTable
            columns={[
              { label: 'Name', value: 'title', td: TitleTD },
              { label: 'Published', value: 'published', td: PublishedTD }
            ]}
            actions={{
              show: true,
              list: [
                { name: 'Edit', route: 'admin_pages_detail', params: { tab: 'pages', subtab: 'edit', id: '{{id}}' }, show: true, component: EditAction },
                { name: 'Remove', route: 'admin_pages_detail', params: { tab: 'pages', subtab: 'remove', id: '{{id}}' }, component: DeleteAction, componentProps: { authorization: this.props.authorization } }
              ]
            }}
            sort={{
              field: 'title',
              value: 1
            }}
            filters={false}
            data={this.getFilteredPages()}
            pageSize={20}
            onChangePage
            onRowDelete={() => this.props.getPages()}
            pagination={pagination}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.pages.pages.loading,
  pages: state.pages.pages.list,
  filteredPages: getFilteredPages(state),
  error: state.pages.pages.error
});
const mapDispatchToProps = dispatch => ({
  getPages: () => dispatch(getPages()),
  setFilters: filters => dispatch(setFilters(filters))
});

export default connect(mapStateToProps, mapDispatchToProps)(PagesTable);
