import React from 'react';
import Pagination from 'rc-pagination';

class Paginator extends React.Component {

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
    this.setState({
      page
    }, () => {
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

Paginator.propTypes = {
  size: React.PropTypes.number,
  page: React.PropTypes.number,
  limit: React.PropTypes.number,
  onChange: React.PropTypes.func
};

export default Paginator;
