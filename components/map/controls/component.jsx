import {
  Children,
  isValidElement,
  cloneElement,
} from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

export default function MapControls({
  customClass,
  children,
  style,
}) {
  return (
    <div
      className={classnames({
        'c-map-controls': true,
        [customClass]: !!customClass,
      })}
      style={style}
    >
      <ul className="map-controls--list">
        {Children.map(children, (c, i) => (
          isValidElement(c) && (
          <li className="map-controls--list-item" key={i}>
            {cloneElement(c)}
          </li>
          )
        ))}
      </ul>
    </div>
  );
}

MapControls.defaultProps = {
  customClass: null,
  style: {},
};

MapControls.propTypes = {
  children: PropTypes.node.isRequired,
  customClass: PropTypes.string,
  style: PropTypes.shape({}),
};
