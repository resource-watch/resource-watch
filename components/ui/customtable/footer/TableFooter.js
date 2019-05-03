import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Paginator from 'components/ui/Paginator';

class TableFooter extends PureComponent {
  static propTypes = {
    pagination: PropTypes.object,
    showTotalPages: PropTypes.bool,
<<<<<<< HEAD
    onChangePage: PropTypes.func.isRequired
=======
    // FUNCTIONS
    onChangePage: PropTypes.func,
    meta: PropTypes.shape({
      totalItems: PropTypes.number.isRequired,
      totalPages: PropTypes.number.isRequired,
      size: PropTypes.number.isRequired
    }).isRequired
>>>>>>> propTypes
  };

  static defaultProps = {
    pagination: {
      enabled: true,
      pageSize: 20,
      page: 0,
      total: null
    },
    showTotalPages: false
  };

  onChangePage(page) { this.props.onChangePage(page); }

  render() {
    const { pagination, showTotalPages } = this.props;

    return (
      <div className="table-footer">
        <Paginator
          options={pagination}
          onChange={page => this.onChangePage(page)}
        />

        {(pagination.enabled && showTotalPages && pagination.pages) &&
          <div>Page <span>{pagination.page}</span> of <span>{pagination.pages}</span></div>
        }

      </div>
    );
  }
}

export default TableFooter;
