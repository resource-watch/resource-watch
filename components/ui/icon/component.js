import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// styles
import './styles.scss';

class Icon extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string
  }

  static defaultProps = { className: null }

  render() {
    const { className, name } = this.props;
    const componentClass = classnames('c-icon', { [className]: !!className });

    return (
      <svg className={componentClass}>
        <use xlinkHref={`#${name}`} />
      </svg>
    );
  }
}

export default Icon;
