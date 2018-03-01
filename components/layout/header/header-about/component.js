import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { Link } from 'routes';

// Components
import TetherComponent from 'react-tether';

export default class HeaderAbout extends React.PureComponent {
  toggleDropdown = debounce((bool) => {
    this.props.setDropdownOpened({ about: bool });
  }, 50)

  render() {
    const { children } = this.props;

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
        <Link route="about" >
          <a
            onMouseEnter={() => this.toggleDropdown(true)}
            onMouseLeave={() => this.toggleDropdown(false)}
          >
                About
          </a>
        </Link>
        {/* Second child: If present, this item will be tethered to the the first child */}
        {this.props.header.dropdownOpened.about &&
        <ul
          className="header-dropdown-list"
          onMouseEnter={() => this.toggleDropdown(true)}
          onMouseLeave={() => this.toggleDropdown(false)}
        >
          {children.map(c => (
            <li
              className="header-dropdown-list-item"
              key={c.label}
            >
              {!!c.route &&
                <Link route={c.route} params={c.params}>
                  <a>{c.label}</a>
                </Link>
              }

              {!!c.href &&
                <a href={c.href}>
                  {c.label}
                </a>
              }

              {!c.route && !c.href &&
                <span>
                  {c.label}
                </span>
              }
            </li>
          ))}
        </ul>
      }
      </TetherComponent>
    );
  }
}

HeaderAbout.propTypes = {
  header: PropTypes.object,
  children: PropTypes.array,
  setDropdownOpened: PropTypes.func
};
