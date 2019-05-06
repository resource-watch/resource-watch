import React from 'react';
import PropTypes from 'prop-types';
import Paginator from 'components/ui/Paginator';

export default class TableFooter extends React.Component {
  static propTypes = {
    pagination: PropTypes.object,
    showTotalPages: PropTypes.bool,
    // FUNCTIONS
    onChangePage: PropTypes.func,
    meta: PropTypes.shape({
      totalItems: PropTypes.number.isRequired,
      totalPages: PropTypes.number.isRequired,
      size: PropTypes.number.isRequired
    }).isRequired
  };

  static defaultProps = {
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

  // UI EVENTS
  // - onChangePage
  onChangePage(page) {
    this.props.onChangePage && this.props.onChangePage(page);
  }

  render() {
    const { pagination, showTotalPages, meta } = this.props;
    if (meta) {
      const { totalPages, size } = this.props.meta;

      return (
        <div className="table-footer">
          <Paginator
            options={{
              page: pagination.page,
              size: totalPages,
              limit: size
            }}
            onChange={page => this.onChangePage(page)}
          />

          {pagination.enabled && showTotalPages &&
            <div>Page <span>{pagination.page}</span> of <span>{totalPages}</span></div>
          }

        </div>
      );
    }

    return null;
  }
}
