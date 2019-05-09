import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Paginator from 'components/ui/Paginator';

class TableFooter extends PureComponent {
  static propTypes = {
    pagination: PropTypes.object,
    showTotalPages: PropTypes.bool,
    onChangePage: PropTypes.func.isRequired
  };

  static defaultProps = {
    pagination: {
      enabled: true,
      pageSize: 20,
      page: 1,
      total: null
    },
    showTotalPages: false
  };

  onChangePage(page) { this.props.onChangePage(page); }

  render() {
    const { pagination, showTotalPages } = this.props;

    return (
      <div className="table-footer">
        {(pagination.size > 0) &&
          <Paginator
            options={pagination}
            onChange={page => this.onChangePage(page)}
          />
        }
        {(pagination.enabled && showTotalPages && pagination.pages && (pagination.size > 0)) &&
          <div>Page <span>{pagination.page}</span> of <span>{pagination.pages}</span></div>
        }

      </div>
    );
  }
}

export default TableFooter;
