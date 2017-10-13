import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import { Link } from 'routes';
import { toastr } from 'react-redux-toastr';

// Utils
import { get } from 'utils/request';

// Components
import TetherComponent from 'react-tether';

class HeaderUser extends React.Component {
  /**
   * UI EVENTS
   * - logout
  */
  logout(e) {
    if (e) {
      e.preventDefault();
    }

    // Get to logout
    get({
      url: `${process.env.CONTROL_TOWER_URL}/auth/logout`,
      withCredentials: true,
      onSuccess: () => {
        try {
          localStorage.removeItem('user');
          window.location.href = `/logout?callbackUrl=${window.location.href}`;
        } catch (err) {
          window.location.href = `/logout?callbackUrl=${window.location.href}`;
        }
      },
      onError: (err) => {
        toastr.error('Error', err);
      }
    });
  }


  render() {
    const { user } = this.props;

    if (!isEmpty(user)) {
      const activeNotificationClassName = classnames({
        '-active': !!user.notifications
      });

      const avatar = (user.avatar) ? `url(${user.avatar})` : 'none';

      return (
        <div className="c-avatar" style={{ backgroundImage: avatar }}>
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
            <Link route="myrw">
              <a
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.props.onMouseLeave}
              >
                {!user.avatar && <span className="avatar-letter">{user.email && user.email.split('')[0]}</span>}
                {user.notifications && <span className={`avatar-notifications ${activeNotificationClassName}`}>{user.notifications}</span>}
              </a>
            </Link>
            {/* Second child: If present, this item will be tethered to the the first child */}
            {this.props.active &&
              <ul
                className="header-dropdown-list"
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.props.onMouseLeave}
              >
                <li className="header-dropdown-list-item">
                  <Link route="myrw">
                    <a>Profile</a>
                  </Link>
                </li>
                {user.role === 'ADMIN' &&
                  <li className="header-dropdown-list-item">
                    <a href="/admin">Admin</a>
                  </li>
                }
                <li className="header-dropdown-list-item">
                  <a onClick={this.logout} href="/logout">Logout</a>
                </li>
              </ul>
            }
          </TetherComponent>
        </div>
      );
    }

    if (isEmpty(user)) {
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
          <span
            className="header-menu-link"
            onMouseEnter={this.props.onMouseEnter}
            onMouseLeave={this.props.onMouseLeave}
          >
            Log in
          </span>
          {/* Second child: If present, this item will be tethered to the the first child */}
          {this.props.active &&
            <ul
              className="header-dropdown-list"
              onMouseEnter={this.props.onMouseEnter}
              onMouseLeave={this.props.onMouseLeave}
            >
              <li className="header-dropdown-list-item">
                <a href={`https://production-api.globalforestwatch.org/auth/facebook?callbackUrl=${process.env.CALLBACK_URL}&applications=rw&token=true`}>
                  Facebook
                </a>
              </li>
              <li className="header-dropdown-list-item">
                <a href={`https://production-api.globalforestwatch.org/auth/google?callbackUrl=${process.env.CALLBACK_URL}&applications=rw&token=true`}>
                  Google
                </a>
              </li>
              <li className="header-dropdown-list-item">
                <a href={`https://production-api.globalforestwatch.org/auth/twitter?callbackUrl=${process.env.CALLBACK_URL}&applications=rw&token=true`}>
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

HeaderUser.propTypes = {
  user: PropTypes.object,
  active: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func
};


export default HeaderUser;
