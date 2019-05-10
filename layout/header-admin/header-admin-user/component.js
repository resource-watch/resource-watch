import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';
import { toastr } from 'react-redux-toastr';
import debounce from 'lodash/debounce';

// components
import TetherComponent from 'react-tether';
import Icon from 'components/ui/Icon';

// services
import { logout } from 'services/UserService';

class AdminHeaderUser extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    header: PropTypes.object.isRequired,
    setDropdownOpened: PropTypes.func.isRequired
  }

  onLogout = () => {
    logout()
      .then((response) => {
        const { status } = response;

        if (status === 200) {
          window.location.href = `/logout?callbackUrl=${window.location.href}`;
        }
      })
      .catch((err) => {
        const { statusText } = err;
        toastr.error('Error: ', statusText);
      });
  };

  toggleDropdown = debounce((bool) => {
    this.props.setDropdownOpened({ myrw: bool });
  }, 50)

  render() {
    const { user } = this.props;

    if (user.token) {
      const photo = (user.photo) ? `url(${user.photo})` : 'none';

      return (
        <div className="c-avatar" style={{ backgroundImage: photo }}>
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
                {(!user.photo && user.email) &&
                  <span className="avatar-letter" >
                    {user.email.split('')[0]}
                  </span>
                }
              </a>
            </Link>
            {/* Second child: If present, this item will be tethered to the the first child */}
            {this.props.header.dropdownOpened.myrw &&
              <ul
                className="header-dropdown-list"
                onMouseEnter={() => this.toggleDropdown(true)}
                onMouseLeave={() => this.toggleDropdown(false)}
              >
                <li className="header-dropdown-list-item">
                  <Link route="myrw" params={{ tab: 'profile' }}>
                    <a>Profile</a>
                  </Link>
                </li>
                {user.role === 'ADMIN' &&
                  <li className="header-dropdown-list-item">
                    <Link route="admin_home">
                      <a>Admin</a>
                    </Link>
                  </li>
                }
                <li className="header-dropdown-list-item">
                  <button onClick={this.onLogout} href="/logout">Logout</button>
                </li>
              </ul>
            }
          </TetherComponent>
        </div>
      );
    }

    if (!user.token) {
      return (
        <TetherComponent
          attachment="top center"
          constraints={[{ to: 'window' }]}
          targetOffset="0 0"
          classes={{ element: 'c-header-dropdown' }}
        >
          {/* First child: This is what the item will be tethered to */}
          <span
            className="header-menu-link"
            onMouseEnter={() => this.toggleDropdown(true)}
            onMouseLeave={() => this.toggleDropdown(false)}
          >
            <Icon name="icon-user" className="-medium" />
          </span>

          {/* Second child: If present, this item will be tethered to the the first child */}
          {this.props.header.dropdownOpened.myrw &&
            <ul
              className="header-dropdown-list"
              onMouseEnter={() => this.toggleDropdown(true)}
              onMouseLeave={() => this.toggleDropdown(false)}
            >
              <li className="header-dropdown-list-item">
                <a href="/auth/facebook">
                  Facebook
                </a>
              </li>
              <li className="header-dropdown-list-item">
                <a href="/auth/google">
                  Google
                </a>
              </li>
              <li className="header-dropdown-list-item">
                <a href="/auth/twitter">
                  Twitter
                </a>
              </li>
            </ul>
          }
        </TetherComponent>
      );
    }
    return null;
  }
}

export default AdminHeaderUser;
