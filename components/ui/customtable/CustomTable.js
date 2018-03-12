import React from 'react';
import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import isEqual from 'lodash/isEqual';

// Components
import TableHeader from './header/TableHeader';
import TableContent from './content/TableContent';
import TableFooter from './footer/TableFooter';

export default class CustomTable extends React.Component {
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
      // Data
      data,
      // Columns
      columnValues: CustomTable.getColumnValues(data)
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      pagination: props.pagination,
      // Sort
      sort: props.sort,
      initialSort: props.sort,
      // Search
      search: {},
      // Columns
      columnQueries: {},
      // Rows
      rowSelection: []
    };

    // Bindings
    this.onChangePage = this.onChangePage.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onSort = this.onSort.bind(this);
    this.onSearch = this.onSearch.bind(this);

    this.onRowDelete = this.onRowDelete.bind(this);
    this.onToggleSelectedRow = this.onToggleSelectedRow.bind(this);
  }

  /**
   * COMPONENT LIFECYCLE
   * - componentWillMount
  */
  componentWillMount() {
    this.setState(CustomTable.setTableData(this.props), () => {
      this.filter();
    });
  }

  componentWillReceiveProps(nextProps) {
    const currentColumnsKeys = CustomTable.getColumnKeys(this.state.data).sort();
    const nextColumnsKeys = CustomTable.getColumnKeys(nextProps.data).sort();


    // TODO: check if the data has changed to reload all the data or only to filter it
    // if you only check the length, sometimes you have only edited one dataset,
    // so the table will not render the new values

    this.setState(CustomTable.setTableData(nextProps), () => {
      this.filter();
    });

    if (!isEqual(currentColumnsKeys, nextColumnsKeys)) {
      this.setState({
        // Sort
        sort: nextProps.sort,
        // Search
        search: {},
        // Columns
        columnQueries: {},
        // Rows
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
  onToggleSelectedRow(id) {
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

  onRowDelete(id) {
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

  onFilter(q) {
    let columnQueries = this.state.columnQueries;

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

    this.setState({
      columnQueries
    }, () => {
      this.filter();
      this.onChangePage(0);
    });
  }

  onSort(s) {
    const { sort, initialSort } = this.state;

    const newSortingRule = {
      field: s.field,
      value: s.value
    };

    // check if we are trying to sort on the same as before, then return to initial sorting
    if (isEqual(s, sort)) {
      this.setState({ sort: initialSort }, () => {
        if (this.props.onSort) {
          this.props.onSort(newSortingRule);
        } else {
          this.onChangePage(0);
        }
      });
    } else {
      this.setState({ sort: newSortingRule }, () => {
        if (this.props.onSort) {
          this.props.onSort(newSortingRule);
        } else {
          this.onChangePage(0);
        }
      });
    }

    if (this.props.onSort) {
      this.props.onSort(newSortingRule);
    }
  }

  onSearch(s) {
    const search = {
      field: s.field,
      value: s.value
    };
    this.setState({ search }, () => {
      this.filter();
      this.onChangePage(0);
    });
  }

  onChangePage(page) {
    if (this.props.onChangePage) {
      this.props.onChangePage(page);
    }

    this.setState({
      pagination: {
        ...this.state.pagination,
        page
      }
    });
  }

  /**
   * FILTER
   * - filter
  */
  filter() {
    const { pagination, columnQueries, search } = this.state;

    // TODO: Verify if we need the old logic, now we will do a DB search
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

    const maxPage = Math.ceil(filteredData.length / pagination.pageSize);

    // Check if the page is equal to the total
    const page = (pagination.page !== 0 && pagination.page === maxPage) && !pagination.dynamic ?
      pagination.page - 1 : pagination.page;

    this.setState({
      filteredData,
      pagination: {
        ...pagination,
        page,
        total: filteredData.length
      }
    });
  }

  /* Render */
  render() {
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
          pagination={this.state.pagination}
          onChangePage={this.onChangePage}
          showTotalPages
        />
      </div>
    );
  }
}

/* Property typing */
CustomTable.propTypes = {
  actions: PropTypes.object,
  columns: PropTypes.array,
  data: PropTypes.array,
  pagination: PropTypes.object,
  filters: PropTypes.bool,
  sort: PropTypes.object,
  onToggleSelectedRow: PropTypes.func,
  onChangePage: PropTypes.func,
  onRowDelete: PropTypes.func,
  onSort: PropTypes.func
};

/* Property default values */
CustomTable.defaultProps = {
  data: [],
  columns: [],
  pagination: {
    enabled: true,
    pageSize: 20,
    page: 0,
    total: null
  },
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
