import React from 'react';
import PropTypes from 'prop-types';
import Pagination from 'rc-pagination';

class Paginator extends React.Component {
  constructor(props) {
    super(props);
    // BINDINGS
    this.triggerChangePage = this.triggerChangePage.bind(this);
  }

  /**
   * UI EVENTS
   * - triggerChangePage (page, size)
  */
  triggerChangePage(page) {
    if (this.props.onChange) this.props.onChange(page);
  }

  render() {
    const { size, page, limit } = this.props.options;
    return (
      <div className="c-paginator">
        <Pagination
          current={page}
          total={size}
          pageSize={limit}
          onChange={this.triggerChangePage}
        />
      </div>
    );
  }
}

Paginator.propTypes = {
  options: PropTypes.object,
  onChange: PropTypes.func
};

export default Paginator;
