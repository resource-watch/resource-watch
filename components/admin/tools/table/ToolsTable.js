import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

import { getTools, setFilters } from 'redactions/admin/tools';

// Selectors
import getFilteredTools from 'selectors/admin/tools';

// Components
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';
import SearchInput from 'components/ui/SearchInput';

// constants
import { INITIAL_PAGINATION } from 'components/admin/tools/table/constants';

// Table components
import EditAction from './actions/EditAction';
import DeleteAction from './actions/DeleteAction';

// TDs
import TitleTD from './td/name';
import PublishedTD from './td/published';
import RoleTD from './td/role';

class ToolsTable extends PureComponent {
  static propTypes = {
    authorization: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    tools: PropTypes.array.isRequired,
    filteredTools: PropTypes.array.isRequired,
    error: PropTypes.string,
    getTools: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired,
  };

  state = { pagination: INITIAL_PAGINATION }

  componentDidMount() {
    this.props.setFilters([]);
    this.props.getTools();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { filteredTools: tools } = this.props;
    const { filteredTools: nextTools } = nextProps;
    const { pagination } = this.state;
    const toolsChanged = tools.length !== nextTools.length;

    this.setState({
      pagination: {
        ...pagination,
        size: nextTools.length,
        ...(toolsChanged && { page: 1 }),
        pages: Math.ceil(nextTools.length / pagination.limit),
      },
    });
  }

  /**
   * Event handler executed when the user search for a dataset
   * @param {string} { value } Search keywords
   */
  onSearch = (value) => {
    if (!value.length) {
      this.props.setFilters([]);
    } else {
      this.props.setFilters([{ key: 'title', value }]);
    }
  }

  onChangePage = (page) => {
    const { pagination } = this.state;

    this.setState({
      pagination: {
        ...pagination,
        page,
      },
    });
  }

  /**
   * HELPERS
   * - getTools
   * - getFilteredTools
  */
  getTools() {
    return this.props.tools;
  }

  getFilteredTools() {
    return this.props.filteredTools;
  }

  render() {
    const { filteredTools } = this.props;
    const { pagination } = this.state;

    return (
      <div className="c-tools-table">
        <Spinner className="-light" isLoading={this.props.loading} />

        {this.props.error && (
          <p>
            Error:
            {this.props.error}
          </p>
        )}

        <SearchInput
          input={{ placeholder: 'Search tool' }}
          link={{
            label: 'New tool',
            route: '/admin/tools/tools/new',
            // params: { tab: 'tools', id: 'new' },
          }}
          onSearch={this.onSearch}
        />

        {!this.props.error && (
          <CustomTable
            columns={[
              { label: 'Name', value: 'title', td: TitleTD },
              { label: 'Role', value: 'role', td: RoleTD },
              { label: 'Published', value: 'published', td: PublishedTD },
            ]}
            actions={{
              show: true,
              list: [
                {
                  name: 'Edit', route: '/admin/tools/tools/{{id}}/edit', params: { tab: 'tools', subtab: 'edit', id: '{{id}}' }, show: true, component: EditAction,
                },
                {
                  name: 'Remove', route: '/admin/tools/tools/{{id}}', params: { tab: 'tools', subtab: 'remove', id: '{{id}}' }, component: DeleteAction, componentProps: { authorization: this.props.authorization },
                },
              ],
            }}
            sort={{
              field: 'title',
              value: 1,
            }}
            filters={false}
            data={filteredTools}
            manualPagination
            onChangePage={this.onChangePage}
            onRowDelete={() => this.props.getTools()}
            pagination={pagination}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.tools.loading,
  tools: state.tools.list,
  filteredTools: getFilteredTools(state),
  error: state.tools.error,
});
const mapDispatchToProps = (dispatch) => ({
  getTools: () => dispatch(getTools()),
  setFilters: (filters) => dispatch(setFilters(filters)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ToolsTable);
