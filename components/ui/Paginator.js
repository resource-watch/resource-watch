import React from 'react';
import PropTypes from 'prop-types';
import Pagination from 'rc-pagination';

class Paginator extends React.Component {
  static propTypes = {
    options: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);

    this.state = {
      size: props.options.size,
      page: props.options.page,
      limit: props.options.limit
    };

    // BINDINGS
    this.triggerChangePage = this.triggerChangePage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      size: nextProps.options.size,
      page: nextProps.options.page,
      limit: nextProps.options.limit
    });
  }

  /**
   * UI EVENTS
   * - triggerChangePage (page, size)
  */
  triggerChangePage(page) {
    this.setState({ page }, () => {
      if (this.props.onChange) this.props.onChange(this.state.page);
    });
  }

  render() {
    const { size, page, limit } = this.state;
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

export default Paginator;
