import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// Components
import TetherComponent from 'react-tether';

export default function HeaderDropdownData(props) {
  return (
    <TetherComponent
      attachment="top center"
      constraints={[{
        to: 'window'
      }]}
      targetOffset="0 0"
      classes={{
        element: 'c-header-dropdown'
      }}
    >
      {/* First child: This is what the item will be tethered to */}
      <a
        href="/data"
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
      >
        Data
      </a>
      {/* Second child: If present, this item will be tethered to the the first child */}
      {props.active &&
        <ul
          className="header-dropdown-list"
          onMouseEnter={props.onMouseEnter}
          onMouseLeave={props.onMouseLeave}
        >
          <li className="header-dropdown-list-item">
            <Link route="explore">
              <a>Explore Datasets</a>
            </Link>
          </li>
          <li className="header-dropdown-list-item">
            <Link route="dashboards">
              <a>Dashboards</a>
            </Link>
          </li>
          <li className="header-dropdown-list-item">
            <a href="/data/pulse">Planet Pulse</a>
          </li>
          <li className="header-dropdown-list-item">
            <Link route="get_involved_detail" params={{ id: 'apps' }}>
              <a>App Gallery</a>
            </Link>
          </li>
        </ul>
      }
    </TetherComponent>
  );
}

HeaderDropdownData.propTypes = {
  active: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func
};
