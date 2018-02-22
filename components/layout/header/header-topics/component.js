import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { Link } from 'routes';

// Components
import TetherComponent from 'react-tether';

export default class HeaderTopics extends React.PureComponent {
  toggleDropdown = debounce((bool) => {
    this.props.setDropdownOpened({ topics: bool });
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
        <Link route="topics" >
          <a
            onMouseEnter={() => this.toggleDropdown(true)}
            onMouseLeave={() => this.toggleDropdown(false)}
          >
                Topics
          </a>
        </Link>
        {/* Second child: If present, this item will be tethered to the the first child */}
        {this.props.header.dropdownOpened.topics &&
        <ul
          className="header-dropdown-list"
          onMouseEnter={() => this.toggleDropdown(true)}
          onMouseLeave={() => this.toggleDropdown(false)}
        >
          <li className="header-dropdown-list-item">
            <Link route="topic_detail" params={{ id: 'biodiversity' }}>
              <a>Biodiversity</a>
            </Link>
          </li>

          <li className="header-dropdown-list-item">
            <Link route="topic_detail" params={{ id: 'cities' }}>
              <a>Cities</a>
            </Link>
          </li>

          <li className="header-dropdown-list-item">
            <Link route="topic_detail" params={{ id: 'climate' }}>
              <a>Climate</a>
            </Link>
          </li>

          <li className="header-dropdown-list-item">
            <Link route="topic_detail" params={{ id: 'commerce' }}>
              <a>Commerce</a>
            </Link>
          </li>

          <li className="header-dropdown-list-item">
            <Link route="topic_detail" params={{ id: 'energy' }}>
              <a>Energy</a>
            </Link>
          </li>

          <li className="header-dropdown-list-item">
            <Link route="topic_detail" params={{ id: 'food_and_agriculture' }}>
              <a>Food and Agriculture</a>
            </Link>
          </li>

          <li className="header-dropdown-list-item">
            <Link route="topic_detail" params={{ id: 'forest' }}>
              <a>Forests</a>
            </Link>
          </li>

          <li className="header-dropdown-list-item">
            <Link route="topic_detail" params={{ id: 'water' }}>
              <a>Water</a>
            </Link>
          </li>
        </ul>
              }
      </TetherComponent>
    );
  }
}

HeaderTopics.propTypes = {
  header: PropTypes.object,
  setDropdownOpened: PropTypes.func
};
