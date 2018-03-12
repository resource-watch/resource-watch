import React from 'react';
import PropTypes from 'prop-types';

import includes from 'lodash/includes';

// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getWidgets, setFilters } from 'redactions/admin/widgets';

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
import OwnershipTD from './td/OwnershipTD';


class WidgetsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: ''
    };

    // ------------------- Bindings -----------------------
    this.onSearch = this.onSearch.bind(this);
    // ----------------------------------------------------
  }

  /**
   * Event handler executed when the user search for a dataset
   * @param {string} { value } Search keywords
   */
  onSearch(searchValue) {
    if (!searchValue.length) {
      this.props.setFilters([]);
    } else {
      this.props.setFilters([{ key: 'name', value: searchValue }]);
    }

    this.setState({ searchValue });
  }

  /**
   * HELPERS
   * - getWidgets
   * - getFilteredWidgets
  */
  getWidgets() {
    const { widgets } = this.props;
    const { searchValue } = this.state;
    if (searchValue.length > 0) {
      return widgets.list.filter(widget =>
        includes(widget.name.toLowerCase(), searchValue.toLowerCase()));
    }
    return widgets.list;
  }

  render() {
    const {
      user,
      dataset,
      widgets,
      loading,
      error
    } = this.props;

    return (
      <div className="c-widgets-table">
        <Spinner className="-light" isLoading={loading} />

        {error && (
          <p>Error: {error}</p>
        )}

        <SearchInput
          input={{
            placeholder: 'Search widget',
            value: this.state.searchValue
          }}
          link={{
            label: 'New widget',
            route: 'admin_data_detail',
            params: {
              tab: 'widgets',
              id: 'new',
              ...!!dataset && { dataset }
            }
          }}
          onSearch={this.onSearch}
        />

        {!error && (
          <CustomTable
            columns={[
              { label: 'Title', value: 'name', td: TitleTD, tdProps: { dataset } },
              // { label: 'Dataset', value: 'dataset', td: DatasetTD },
              { label: 'Published', value: 'published', td: PublishedTD },
              { label: 'Ownership', value: 'userId', td: OwnershipTD, tdProps: { user } }
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
            data={this.getWidgets()}
            pageSize={20}
            onRowDelete={() => this.props.getWidgets({
              dataset
            })}
            pagination={{
              enabled: true,
              pageSize: 20,
              page: widgets.pagination.page - 1
            }}
          />
        )}
      </div>
    );
  }
}

WidgetsTable.propTypes = {
  authorization: PropTypes.string,
  dataset: PropTypes.string,
  // Store
  loading: PropTypes.bool.isRequired,
  widgets: PropTypes.object.isRequired,
  error: PropTypes.string,
  user: PropTypes.object,

  // Actions
  getWidgets: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  loading: state.widgets.widgets.loading,
  widgets: state.widgets.widgets,
  error: state.widgets.widgets.error,
  user: state.user
});
const mapDispatchToProps = dispatch => bindActionCreators({
  getWidgets,
  setFilters
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WidgetsTable);
