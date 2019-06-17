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
    const { size, pages, page, enabled } = pagination;

    if (size > 0 && pages > 1) {
      return (
        <div className="table-footer">
          <Paginator
            options={pagination}
            onChange={(pageValue) => { this.onChangePage(pageValue); }}
          />

          {(enabled && showTotalPages) &&
            (<div>Page <span>{page}</span> of <span>{pages}</span></div>)}

        </div>
      );
    }
    return null;
  }
}

export default TableFooter;
