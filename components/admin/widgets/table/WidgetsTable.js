import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import { connect } from 'react-redux';

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
// import DatasetTD from './td/DatasetTD';


class WidgetsTable extends React.Component {
  componentDidMount() {
    this.props.setFilters([]);
    // TODO: get filtered widgets
    this.props.getWidgets({
      dataset: this.props.dataset
    });
  }

  /**
   * Event handler executed when the user search for a dataset
   * @param {string} { value } Search keywords
   */
  @Autobind
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
    return this.props.widgets;
  }

  getFilteredWidgets() {
    return this.props.filteredWidgets;
  }

  render() {
    const { user, dataset } = this.props;
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
            data={this.getFilteredWidgets()}
            pageSize={20}
            onRowDelete={() => this.props.getWidgets({
              dataset: this.props.dataset
            })}
            pagination={{
              enabled: true,
              pageSize: 20,
              page: 0
            }}
          />
        )}
      </div>
    );
  }
}

WidgetsTable.defaultProps = {
  columns: [],
  actions: {},
  dataset: '',
  // Store
  widgets: [],
  filteredWidgets: [],
  user: {}
};

WidgetsTable.propTypes = {
  authorization: PropTypes.string,
  dataset: PropTypes.string,
  // Store
  loading: PropTypes.bool.isRequired,
  widgets: PropTypes.array.isRequired,
  filteredWidgets: PropTypes.array.isRequired,
  error: PropTypes.string,
  user: PropTypes.object,

  // Actions
  getWidgets: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  loading: state.widgets.widgets.loading,
  widgets: state.widgets.widgets.list,
  filteredWidgets: getFilteredWidgets(state),
  error: state.widgets.widgets.error,
  user: state.user
});
const mapDispatchToProps = dispatch => ({
  getWidgets: options => dispatch(getWidgets(options)),
  setFilters: filters => dispatch(setFilters(filters))
});

export default connect(mapStateToProps, mapDispatchToProps)(WidgetsTable);
