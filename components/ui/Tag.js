import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Icon from 'components/ui/Icon'

class Tag extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    isRemovable: PropTypes.bool,

    onClick: PropTypes.func
  }

  render() {
    const { name, className, isRemovable } = this.props;
    return (
      <button
        className={`c-tag ${classnames({
          [className]: !!className
        })}`}
        onClick={this.props.onClick}
      >
        <span>{name}</span>

        {isRemovable &&
          <Icon
            name="icon-cross"
            className="-tiny"
          />
        }
      </button>
    );
  }
}

export default Tag;
