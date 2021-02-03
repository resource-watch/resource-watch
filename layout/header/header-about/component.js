import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import TetherComponent from 'react-tether';
import { Link } from 'routes';

class HeaderAbout extends PureComponent {
  static propTypes = {
    header: PropTypes.object.isRequired,
    children: PropTypes.array,
    setDropdownOpened: PropTypes.func.isRequired,
  }

  static defaultProps = { children: [] }

  toggleDropdown = debounce((bool) => {
    const { setDropdownOpened } = this.props;

    setDropdownOpened({ about: bool });
  }, 50)

  render() {
    const {
      header: { dropdownOpened },
      children,
    } = this.props;

    return (
      <TetherComponent
        attachment="top center"
        constraints={[{ to: 'window' }]}
        targetOffset="0 0"
        classes={{ element: 'c-header-dropdown' }}
      >
        {/* first child: this is what the item will be tethered to */}
        <Link route="about">
          <a
            onMouseEnter={() => this.toggleDropdown(true)}
            onMouseLeave={() => this.toggleDropdown(false)}
          >
            About
          </a>
        </Link>
        {/* second child: if present, this item will be tethered to the the first child */}
        {dropdownOpened.about
        && (
        <ul
          className="header-dropdown-list"
          onMouseEnter={() => this.toggleDropdown(true)}
          onMouseLeave={() => this.toggleDropdown(false)}
        >
          {children.map((c) => (
            <li
              className="header-dropdown-list-item"
              key={c.label}
            >
              {!!c.route
                && (
                <Link route={c.route} params={c.params}>
                  <a>{c.label}</a>
                </Link>
                )}

              {!!c.href
                && (
                <a href={c.href}>
                  {c.label}
                </a>
                )}

              {!c.route && !c.href
                && (
                <span>
                  {c.label}
                </span>
                )}
            </li>
          ))}
        </ul>
        )}
      </TetherComponent>
    );
  }
}

export default HeaderAbout;
