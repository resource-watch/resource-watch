import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getWidgets, setFilters } from 'redactions/admin/widgets';

// Selectors
import getFilteredWidgets from 'selectors/admin/widgets';

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

    // ------------------- Bindings -----------------------
    this.onSearch = this.onSearch.bind(this);
    // ----------------------------------------------------
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

  /**
   * HELPERS
   * - getWidgets
   * - getFilteredWidgets
  */
  getWidgets() {
    return this.props.widgets.list;
  }

  render() {
    const { user, dataset, widgets } = this.props;

    console.log('widgets table', widgets);

    return (
      <div className="c-widgets-table">
        <Spinner className="-light" isLoading={this.props.loading} />

        {this.props.error && (
          <p>Error: {this.props.error}</p>
        )}

        <SearchInput
          input={{
            placeholder: 'Search widget'
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

        {!this.props.error && (
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
            data={widgets.list}
            pageSize={widgets.pagination.total}
            onRowDelete={() => this.props.getWidgets({
              dataset
            })}
            pagination={{
              enabled: true,
              pageSize: widgets.pagination.total,
              page: widgets.pagination.page
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
