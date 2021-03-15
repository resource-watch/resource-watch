import React, {
  useState,
} from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { toastr } from 'react-redux-toastr';
import Tether from 'react-tether';
import { useDebouncedCallback } from 'use-debounce';

// components
import Icon from 'components/ui/icon';

const HeaderUser = ({
  user,
}) => {
  const [isVisible, setVisibility] = useState(false);

  const logout = (e) => {
    if (e) e.preventDefault();

    // TO-DO: move this to an action
    fetch(`${process.env.WRI_API_URL}/auth/logout`, { credentials: 'include' })
      .then(() => {
        window.location.href = `/logout?callbackUrl=${window.location.href}`;
      })
      .catch((err) => {
        toastr.error('Error', err);
      });
  };

  const [toggleDropdown] = useDebouncedCallback((_isVisible) => {
    setVisibility(_isVisible);
  }, 50);

  const {
    token,
    photo,
    role,
    email,
  } = user;

  if (token) {
    const userAvatar = photo ? `url(${photo})` : 'none';

    return (
      <div className="c-avatar" style={{ backgroundImage: userAvatar }}>
        <Tether
          attachment="top center"
          constraints={[{
            to: 'window',
          }]}
          classes={{ element: 'c-header-dropdown' }}
          renderTarget={(ref) => (
            <Link href="/myrw">
              <a
                ref={ref}
                onMouseEnter={() => toggleDropdown(true)}
                onMouseLeave={() => toggleDropdown(false)}
              >
                {(!photo && email)
                  && (
                  <span className="avatar-letter">
                    {email.split('')[0]}
                  </span>
                  )}
              </a>
            </Link>
          )}
          renderElement={(ref) => {
            if (!isVisible) return null;

            return (
              <div
                ref={ref}
                onMouseEnter={() => toggleDropdown(true)}
                onMouseLeave={() => toggleDropdown(false)}
              >
                <ul className="header-dropdown-list myrw-list">
                  <li className="header-dropdown-list-item">
                    <Link href="/myrw/areas">
                      <a>Areas of interest</a>
                    </Link>
                  </li>
                  <li className="header-dropdown-list-item">
                    <Link href="/myrw/collections">
                      <a>Collections</a>
                    </Link>
                  </li>
                  <li className="header-dropdown-list-item">
                    <Link href="/myrw/dashboards">
                      <a>Dashboards</a>
                    </Link>
                  </li>
                  <li className="header-dropdown-list-item">
                    <Link href="/myrw/datasets/my_datasets">
                      <a>Datasets</a>
                    </Link>
                  </li>
                  <li className="header-dropdown-list-item">
                    <Link href="/myrw/widgets/my_widgets">
                      <a>Visualizations</a>
                    </Link>
                  </li>
                </ul>
                <ul className="header-dropdown-list user-list">
                  <li className="header-dropdown-list-item">
                    <Link href="/myrw/profile">
                      <a>Profile</a>
                    </Link>
                  </li>
                  {role === 'ADMIN'
                    && (
                    <li className="header-dropdown-list-item">
                      <Link
                        href="/admin"
                      >
                        <a>Admin</a>
                      </Link>
                    </li>
                    )}
                  <li className="header-dropdown-list-item">
                    <a onClick={logout} href="/logout">Logout</a>
                  </li>
                </ul>
              </div>
            );
          }}
        />
      </div>
    );
  }

  return (
    <Link href="/sign-in">
      <a className="header-menu-link">
        <Icon
          name="icon-user"
          className="-medium user-icon"
        />
      </a>
    </Link>
  );
};

HeaderUser.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string,
    role: PropTypes.string,
    email: PropTypes.string,
    photo: PropTypes.string,
  }).isRequired,
};

export default HeaderUser;
