import React from 'react';
import Paginator from '../../Paginator';

export default class TableFooter extends React.Component {

  // UI EVENTS
  // - onChangePage
  onChangePage(page) {
    this.props.onChangePage && this.props.onChangePage(page - 1);
  }

  render() {
    const { pagination, showTotalPages } = this.props;
    const maxPage = Math.ceil(pagination.total / pagination.pageSize) || 1;

    return (
      <div className="table-footer">
        <Paginator
          options={{
            page: pagination.page + 1,
            size: pagination.total,
            limit: pagination.pageSize
          }}
          onChange={page => this.onChangePage(page)}
        />

        {/* Page locator */}
        {pagination.enabled && showTotalPages &&
          <div>Page <span>{pagination.page + 1}</span> of <span>{maxPage}</span></div>
        }
      </div>
    );
  }
}

TableFooter.propTypes = {
  pagination: React.PropTypes.object,
  showTotalPages: React.PropTypes.bool,
  // FUNCTIONS
  onChangePage: React.PropTypes.func
};

TableFooter.defaultProps = {
  pagination: {
    enabled: true,
    pageSize: 20,
    page: 1,
    total: null
  },
  showTotalPages: false,
  // FUNCTIONS
  onChangePage: null
};
