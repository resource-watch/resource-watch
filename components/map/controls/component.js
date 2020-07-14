import React, { PureComponent } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

// styles
import './styles.scss';

class MapControls extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    customClass: PropTypes.string
  }

  static defaultProps = { customClass: null }

  render() {
    const { customClass, children } = this.props;
    const componentClass = classnames({
      'c-map-controls': true,
      [customClass]: !!customClass
    });

    return (
      <div className={componentClass}>
        <ul className="map-controls--list">
          {React.Children.map(children, (c, i) => (
            React.isValidElement(c) && (
            <li className="map-controls--list-item" key={i}>
              {React.cloneElement(c)}
            </li>)
          ))}
        </ul>
      </div>
    );
  }
}

export default MapControls;
