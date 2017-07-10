import React from 'react';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import { Link } from 'routes';

// Components
import TetherComponent from 'react-tether';


export default function HeaderUser(props) {
  const { user } = props;

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
          targetOffset="-4px 0"
          classes={{
            element: 'c-header-dropdown'
          }}
        >
          {/* First child: This is what the item will be tethered to */}
          <Link route="myrw">
            <a
              onMouseEnter={props.onMouseEnter}
              onMouseLeave={props.onMouseLeave}
            >
              {!user.avatar && <span className="avatar-letter">{user.email && user.email.split('')[0]}</span>}
              {user.notifications && <span className={`avatar-notifications ${activeNotificationClassName}`}>{user.notifications}</span>}
            </a>
          </Link>
          {/* Second child: If present, this item will be tethered to the the first child */}
          {props.active &&
            <ul
              className="header-dropdown-list"
              onMouseEnter={props.onMouseEnter}
              onMouseLeave={props.onMouseLeave}
            >
              <li className="header-dropdown-list-item">
                <Link route="myrw">
                  <a>My RW</a>
                </Link>
              </li>
              {user.role === 'ADMIN' &&
                <li className="header-dropdown-list-item">
                  <a href="/admin" target="_blank">Admin</a>
                </li>
              }
              <li className="header-dropdown-list-item">
                <a href="/logout">Logout</a>
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
        targetOffset="-4px 0"
        classes={{
          element: 'c-header-dropdown'
        }}
      >
        {/* First child: This is what the item will be tethered to */}
        <a
          href="/login"
          onMouseEnter={props.onMouseEnter}
          onMouseLeave={props.onMouseLeave}
        >
          Log in
        </a>
        {/* Second child: If present, this item will be tethered to the the first child */}
        {props.active &&
          <ul
            className="header-dropdown-list"
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
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
            <li className="header-dropdown-list-item">
              <a href="/login">Admin</a>
            </li>
          </ul>
        }
      </TetherComponent>
    );
  }

  return null;
}

HeaderUser.propTypes = {
  user: React.PropTypes.object,
  active: React.PropTypes.bool,
  onMouseEnter: React.PropTypes.func,
  onMouseLeave: React.PropTypes.func
};
