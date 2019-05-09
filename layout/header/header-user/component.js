import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';
import { toastr } from 'react-redux-toastr';
import TetherComponent from 'react-tether';
import debounce from 'lodash/debounce';

import { logout } from 'services/UserService';

// components
import Icon from 'components/ui/Icon';

class HeaderUser extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    header: PropTypes.object.isRequired,
    setDropdownOpened: PropTypes.func.isRequired
  }

  onLogout = () => {
    logout()
      .catch(({ response }) => {
        const { statusText } = response;
        toastr.error('Error: ', statusText);
      });
  };

  toggleDropdown = debounce((bool) => {
    this.props.setDropdownOpened({ myrw: bool });
  }, 50)

  render() {
    const {
      user: { token, photo, role, email },
      header: { dropdownOpened }
    } = this.props;

    if (token) {
      const userAvatar = photo ? `url(${photo})` : 'none';

      return (
        <div className="c-avatar" style={{ backgroundImage: userAvatar }}>
          <TetherComponent
            attachment="top center"
            constraints={[{ to: 'window' }]}
            targetOffset="0 0"
            classes={{ element: 'c-header-dropdown' }}
          >
            {/* First child: This is what the item will be tethered to */}
            <Link route="myrw">
              <a
                onMouseEnter={() => this.toggleDropdown(true)}
                onMouseLeave={() => this.toggleDropdown(false)}
              >
                {(!photo && email) &&
                  <span className="avatar-letter" >
                    {email.split('')[0]}
                  </span>
                }
              </a>
            </Link>
            {/* Second child: If present, this item will be tethered to the the first child */}
            {dropdownOpened.myrw &&
              <div
                onMouseEnter={() => this.toggleDropdown(true)}
                onMouseLeave={() => this.toggleDropdown(false)}
              >
                <ul className="header-dropdown-list myrw-list">
                  <li className="header-dropdown-list-item">
                    <Link
                      route="myrw"
                      params={{ tab: 'areas' }}
                    >
                      <a>Areas of interest</a>
                    </Link>
                  </li>
                  <li className="header-dropdown-list-item">
                    <Link
                      route="myrw"
                      params={{ tab: 'collections' }}
                    >
                      <a>Collections</a>
                    </Link>
                  </li>
                  <li className="header-dropdown-list-item">
                    <Link
                      route="myrw"
                      params={{ tab: 'dashboards' }}
                    >
                      <a>Dashboards</a>
                    </Link>
                  </li>
                  <li className="header-dropdown-list-item">
                    <Link
                      route="myrw"
                      params={{
                        tab: 'datasets',
                        subtab: 'my_datasets'
                      }}
                    >
                      <a>Datasets</a>
                    </Link>
                  </li>
                  <li className="header-dropdown-list-item">
                    <Link
                      route="myrw"
                      params={{
                        tab: 'widgets',
                        subtab: 'my_widgets'
                      }}
                    >
                      <a>Visualizations</a>
                    </Link>
                  </li>
                </ul>
                <ul className="header-dropdown-list user-list">
                  <li className="header-dropdown-list-item">
                    <Link route="myrw" params={{ tab: 'profile' }}>
                      <a>Profile</a>
                    </Link>
                  </li>
                  {role === 'ADMIN' &&
                    <li className="header-dropdown-list-item">
                      <Link route="admin_home">
                        <a>Admin</a>
                      </Link>
                    </li>
                  }
                  <li className="header-dropdown-list-item">
                    <a onClick={this.onLogout} href="/logout">Logout</a>
                  </li>
                </ul>
              </div>
            }
          </TetherComponent>
        </div>
      );
    }

    return (
      <Link route="sign-in">
        <a className="header-menu-link">
          <Icon
            name="icon-user"
            className="-medium user-icon"
          />
        </a>
      </Link>);
  }
}

export default HeaderUser;
