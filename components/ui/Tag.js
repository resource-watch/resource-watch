import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class Tag extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,

    onClick: PropTypes.func
  }

  render() {
    const { name, className } = this.props;
    return (
      <button
        className={`c-tag ${classnames({
          [className]: !!className
        })}`}
        onClick={this.props.onClick}
      >
        {name}
      </button>
    );
  }
}

export default Tag;
