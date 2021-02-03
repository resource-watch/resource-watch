import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';
import debounce from 'lodash/debounce';
import TetherComponent from 'react-tether';

class HeaderDashboards extends PureComponent {
  static propTypes = {
    header: PropTypes.object.isRequired,
    dashboards: PropTypes.array.isRequired,
    setDropdownOpened: PropTypes.func.isRequired,
  };

  toggleDropdown = debounce((bool) => {
    const { setDropdownOpened } = this.props;
    setDropdownOpened({ dashboards: bool });
  }, 50)

  render() {
    const {
      header: { dropdownOpened },
      dashboards,
    } = this.props;

    return (
      <TetherComponent
        attachment="top center"
        constraints={[{ to: 'window' }]}
        targetOffset="0 0"
        classes={{ element: 'c-header-dropdown' }}
      >
        {/* First child: This is what the item will be tethered to */}
        <Link route="dashboards">
          <a
            onMouseEnter={() => this.toggleDropdown(true)}
            onMouseLeave={() => this.toggleDropdown(false)}
          >
            Dashboards
          </a>
        </Link>
        {/* second child: if present, this item will be tethered to the the first child */}
        {dropdownOpened.dashboards
          && (
          <ul
            className="header-dropdown-list"
            onMouseEnter={() => this.toggleDropdown(true)}
            onMouseLeave={() => this.toggleDropdown(false)}
          >
            {dashboards.map((_dashboard) => (
              <li
                className="header-dropdown-list-item"
                key={_dashboard.params.slug}
              >
                <Link
                  route={_dashboard.route}
                  params={_dashboard.params}
                >
                  <a>{_dashboard.label}</a>
                </Link>
              </li>
            ))}
          </ul>
          )}
      </TetherComponent>
    );
  }
}

export default HeaderDashboards;
