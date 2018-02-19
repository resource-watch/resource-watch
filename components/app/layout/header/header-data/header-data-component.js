import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// Components
import TetherComponent from 'react-tether';

export default function HeaderData(props) {
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
        onMouseEnter={() => props.setDropdownOpened({ data: true })}
        onMouseLeave={() => props.setDropdownOpened({ data: false })}
      >
        Data
      </a>
      {/* Second child: If present, this item will be tethered to the the first child */}
      {props.header.dropdownOpened.data &&
        <ul
          className="header-dropdown-list"
          onMouseEnter={() => props.setDropdownOpened({ data: true })}
          onMouseLeave={() => props.setDropdownOpened({ data: false })}
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

HeaderData.propTypes = {
  header: PropTypes.object,
  setDropdownOpened: PropTypes.func
};
