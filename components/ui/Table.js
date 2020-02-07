import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

export default class Table extends React.Component {
  /* Property typing */
  static propTypes = {
    data: PropTypes.array,
    columns: PropTypes.array,
    actionsColumn: PropTypes.bool,
    paginated: PropTypes.bool,
    pageSize: PropTypes.number
  };

  /* Property default values */
  static defaultProps = {
    data: [],
    columns: [],
    actionsColumn: true,
    paginated: true,
    pageSize: 10
  };

  constructor(props) {
    super(props);

    this.setTableData(props);

    // Bindings
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
  }

  /* Component lifecycle */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.data, nextProps.data)) {
      this.setTableData(nextProps);
    }
  }

  /* Component api */
  setTableData(props) {
    const { data } = props;

    /*
      Initial state
      - props.data => original data
      - filteredData => original data with filters and/or sort (if any) applied
    */
    this.state = {
      filteredData: data,
      currentPage: (this.state && this.state.currentPage) || 0,
      totalPages: Math.ceil(data.length / props.pageSize),
      query: {},
      sort: {}
    };
  }

  getPageBounds(page) {
    const bottom = page * this.props.pageSize;
    const top = bottom + this.props.pageSize;
    return { bottom, top };
  }

  nextPage() {
    if (this.state.currentPage === this.state.totalPages - 1) return;
    this.goToPage(this.state.currentPage + 1);
  }

  prevPage() {
    if (this.state.currentPage === 0) return;
    this.goToPage(this.state.currentPage - 1);
  }

  goToPage(page) {
    this.setState({ currentPage: page });
  }

  /* Partial renders */
  renderTableHead() {
    return (
      <tr>
        {this.props.columns.map((c, index) => (
          <th key={index}>
            <span className="th-wrapper">
              <span>{c.name}</span>
            </span>
          </th>
        ))}
        {this.props.actionsColumn ? <th>Actions</th> : null}
      </tr>
    );
  }

  renderTableContent() {
    const { filteredData } = this.state;
    const { bottom, top } = this.getPageBounds(this.state.currentPage);

    if (!filteredData.length) {
      return (
        <tr>
          <td colSpan={this.props.columns.length}>No results found</td>
        </tr>
      );
    }

    /* Apply pagination to filteredData */
    const paginatedData = filteredData.slice(bottom, top);

    return paginatedData.map((row, index) => (
      <tr key={index}>
        {this.props.columns.map((col, i) => <td key={i} className={col.cellClasses ? col.cellClasses : ''}>{row[col.name]}</td>)}
        {this.props.actionsColumn ? <td>
          <ul className="menu simple">
            <li><a href={`/admin/datasets/${row.id}/edit`}>Edit</a></li>
            <li><a href={`/admin/datasets/${row.id}/remove`}>Remove</a></li>
          </ul>
        </td> : null}
      </tr>
    ));
  }

  renderTableFooter() {
    return (
      <div className="table-footer">
        {/* Paginator */}
        {this.props.paginated &&
          <ul className="pagination" role="navigation">
            <li className="pagination-previous"><button className="paginator-btn" onClick={this.prevPage}>Prev</button></li>
            <li className="pagination-next"><button className="paginator-btn" onClick={this.nextPage}>Next</button></li>
          </ul>
        }
        {/* Page locator */}
        {this.props.paginated &&
          <div>Page <span>{this.state.currentPage + 1}</span> of <span>{this.state.totalPages}</span></div>
        }
      </div>
    );
  }

  /* Render */
  render() {
    return (
      <div className="c-table">
        {/* Table */}
        <table className="table">
          <thead>
            {/* Table head */}
            {this.renderTableHead()}
          </thead>
          <tbody>
            {/* Table content */}
            {this.renderTableContent()}
          </tbody>
        </table>
        {this.renderTableFooter()}
      </div>
    );
  }
}
