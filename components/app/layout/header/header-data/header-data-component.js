import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { Link } from 'routes';

// Components
import TetherComponent from 'react-tether';

export default class HeaderData extends React.PureComponent {
  toggleDropdown = debounce((bool) => {
    this.props.setDropdownOpened({ data: bool });
  }, 50)

  render() {
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
          onMouseEnter={() => this.toggleDropdown(true)}
          onMouseLeave={() => this.toggleDropdown(false)}
        >
          Data
        </a>
        {/* Second child: If present, this item will be tethered to the the first child */}
        {this.props.header.dropdownOpened.data &&
        <ul
          className="header-dropdown-list"
          onMouseEnter={() => this.toggleDropdown(true)}
          onMouseLeave={() => this.toggleDropdown(false)}
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
}

HeaderData.propTypes = {
  header: PropTypes.object,
  setDropdownOpened: PropTypes.func
};
