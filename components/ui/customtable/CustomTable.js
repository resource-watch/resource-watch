import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import isEqual from 'lodash/isEqual';

// Components
import TableHeader from './header/TableHeader';
import TableContent from './content/TableContent';
import TableFooter from './footer/TableFooter';

export default class CustomTable extends PureComponent {
  /* Property typing */
  static propTypes = {
    actions: PropTypes.object,
    columns: PropTypes.array,
    data: PropTypes.array,
    pagination: PropTypes.object,
    filters: PropTypes.bool,
    manualPagination: PropTypes.bool,
    sort: PropTypes.object,
    onToggleSelectedRow: PropTypes.func,
    onRowDelete: PropTypes.func
  };

  /* Property default values */
  static defaultProps = {
    data: [],
    columns: [],
    pagination: {
      enabled: true,
      pageSize: 20,
      page: 1,
      total: null
    },
    manualPagination: false,
    sort: {},
    actions: {
      show: true,
      list: [
        { name: 'Edit', path: '#' },
        { name: 'Remove', path: '#' }
      ]
    },
    filters: true,
    onToggleSelectedRow: null,
    onRowDelete: null
  };

  /**
   * STATIC METHODS
   * - getColumnKeys
   * - getColumnValues
   * - setTableData
  */
  static getColumnKeys(data) {
    return uniq(flatten(data.map(d => Object.keys(d))));
  }

  static getColumnValues(data) {
    const columnsKeys = CustomTable.getColumnKeys(data);
    const columns = {};
    columnsKeys.forEach((key) => {
      const values = uniq(data.map(d => d[key]))
        .sort((a, b) => a - b)
        .map(d => d && d.toString());
      columns[key] = values;
    });
    return columns;
  }

  static setTableData(props) {
    const { data } = props;
    return {
      data,
      columnValues: CustomTable.getColumnValues(data)
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      pagination: props.pagination,
      sort: props.sort,
      initialSort: props.sort,
      search: {},
      columnQueries: {},
      rowSelection: []
    };
  }

  componentWillMount() {
    this.setState(CustomTable.setTableData(this.props), () => {
      this.filter();
    });
  }

  componentWillReceiveProps(nextProps) {
    const currentColumnsKeys = CustomTable.getColumnKeys(this.state.data).sort();
    const nextColumnsKeys = CustomTable.getColumnKeys(nextProps.data).sort();
    this.setState(CustomTable.setTableData(nextProps), () => {
      this.filter();
    });

    if (!isEqual(currentColumnsKeys, nextColumnsKeys)) {
      this.setState({
        ...CustomTable.setTableData(nextProps),
        sort: nextProps.sort,
        search: {},
        columnQueries: {},
        rowSelection: []
      });
    }
  }

  /**
   * UI EVENTS
   * - onToggleSelectedRow
   * - onRowDelete
   * - onFilter
   * - onSort
   * - onChangePage
  */
  onToggleSelectedRow = (id) => {
    const rowSelection = this.state.rowSelection.slice();
    const index = rowSelection.indexOf(id);

    // Toggle the active dataset
    if (index !== -1) {
      rowSelection.splice(index, 1);
    } else {
      rowSelection.push(id);
    }

    this.setState({ rowSelection }, () => {
      if (this.props.onToggleSelectedRow) {
        this.props.onToggleSelectedRow(this.state.rowSelection);
      }
    });
  }

  onRowDelete = (id) => {
    const data = this.state.data.slice();
    const index = data.findIndex(row => row.id === id);
    data.splice(index, 1);

    this.setState({
      // Data
      data,
      // Columns
      columnValues: CustomTable.getColumnValues(data)
    }, () => {
      this.filter();
      if (this.props.onRowDelete) {
        this.props.onRowDelete(id);
      }
    });
  }

  onFilter = (q) => {
    let { columnQueries } = this.state;

    // Let's use null when you select all the values, so whenever you add more points to
    // the map they will be selected because you will remove the filter from the columnQueries
    if (q.value) {
      columnQueries = {
        ...this.state.columnQueries,
        [q.field]: q.value
      };
    } else if (columnQueries[q.field]) {
      delete columnQueries[q.field];
    }

    this.setState({ columnQueries }, () => {
      this.filter();
      // this.onChangePage(0);
    });
  }

  onSort = (s) => {
    const { sort, initialSort } = this.state;

    // check if we are trying to sort on the same as before, then return to initial sorting
    if (isEqual(s, sort)) {
      this.setState({ sort: initialSort });
    } else {
      const newSortingRule = {
        field: s.field,
        value: s.value
      };
      this.setState({ sort: newSortingRule });
    }
  }

  onSearch = (s) => {
    const search = {
      field: s.field,
      value: s.value
    };

    this.setState({ search }, () => {
      this.filter();
      this.onChangePage(0);
    });
  }

  onChangePage = (page) => {
    this.setState({
      pagination: {
        ...this.state.pagination,
        page
      }
    });
    this.props.onChangePage(page);
  }

  /**
   * FILTER
   * - filter
  */
  filter() {
    const { manualPagination, pagination } = this.props;
    const { columnQueries, search } = this.state;

    const filteredData = this.state.data.filter((row) => {
      let filteredBySearch = true;

      if (search.value) {
        filteredBySearch = row[search.field].toString().toLowerCase()
          .includes(search.value.toString().toLowerCase());
      }

      const filteredByQuery = Object.keys(columnQueries).map(field => columnQueries[field]
        .map(val => row[field].toString().toLowerCase() === val.toString()
          .toLowerCase()).some(match => match)).every(match => match);

      return filteredByQuery && filteredBySearch;
    });

    if (manualPagination) {
      const maxPage = Math.ceil(filteredData.length / pagination.pageSize);
      // Check if the page is equal to the total
      const page = (pagination.page !== 0 && pagination.page === maxPage) ?
        pagination.page - 1 : pagination.page;

      this.setState({
        filteredData,
        pagination: {
          ...pagination,
          // page,
          ...search && (search.value || '').length > 0 ? { page: 1 } : { page },
          total: filteredData.length
        }
      });
    }

    this.setState({ filteredData });
  }

  render() {
    const { pagination } = this.props;

    return (
      <div className="c-table">
        {/* Table */}
        <div className="table-header" />
        <table className="table">
          {/* Table header */}
          <TableHeader
            actions={this.props.actions}
            columns={this.props.columns}
            columnValues={this.state.columnValues}
            columnQueries={this.state.columnQueries}
            filteredData={this.state.filteredData}
            filters={this.props.filters}
            sort={this.state.sort}
            onFilter={this.onFilter}
            onSearch={this.onSearch}
            onSort={this.onSort}
          />

          {/* Table content */}

          <TableContent
            {...this.props}
            {...this.state}
            onToggleSelectedRow={this.onToggleSelectedRow}
            onRowDelete={this.onRowDelete}
          />

        </table>
        {/* Table footer */}
        <TableFooter
          pagination={pagination}
          onChangePage={this.onChangePage}
          showTotalPages
        />
      </div>
    );
  }
}
