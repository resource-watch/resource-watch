import {
  useState,
} from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Tether from 'react-tether';
import { useDebouncedCallback } from 'use-debounce';
import { signOut } from 'next-auth/client';

// hooks
import {
  useMe,
} from 'hooks/user';

// components
import Icon from 'components/ui/icon';

const AdminHeaderUser = () => {
  const {
    data: user,
  } = useMe();
  const [isVisible, setVisibility] = useState(false);

  const logout = (e) => {
    if (e) e.preventDefault();
    signOut();
  };

  const [toggleDropdown] = useDebouncedCallback((_isVisible) => {
    setVisibility(_isVisible);
  }, 50);

  if (user) {
    const photo = (user.photo) ? `url(${user.photo})` : 'none';

    return (
      <div className="c-avatar" style={{ backgroundImage: photo }}>
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
                {(!user.photo && user.email) && (
                  <span className="avatar-letter">
                    {user.email.split('')[0]}
                  </span>
                )}
              </a>
            </Link>
          )}
          renderElement={(ref) => {
            if (!isVisible) return null;

            return (
              <ul
                ref={ref}
                className="header-dropdown-list"
                onMouseEnter={() => toggleDropdown(true)}
                onMouseLeave={() => toggleDropdown(false)}
              >
                <li className="header-dropdown-list-item">
                  <Link href="/myrw/profile">
                    <a>Profile</a>
                  </Link>
                </li>
                {user.role === 'ADMIN' && (
                  <li className="header-dropdown-list-item">
                    <Link href="/admin">
                      <a>Admin</a>
                    </Link>
                  </li>
                )}
                <li className="header-dropdown-list-item">
                  <a onClick={logout} href="/logout">Logout</a>
                </li>
              </ul>
            );
          }}
        />
      </div>
    );
  }

  if (user) {
    return (
      <Tether
        attachment="top center"
        constraints={[{
          to: 'window',
        }]}
        classes={{ element: 'c-header-dropdown' }}
        renderTarget={(ref) => (
          <span
            ref={ref}
            className="header-menu-link"
            onMouseEnter={() => toggleDropdown(true)}
            onMouseLeave={() => toggleDropdown(false)}
          >
            <Icon name="icon-user" className="-medium" />
          </span>
        )}
        renderElement={(ref) => {
          if (!isVisible) return null;
          return (
            <ul
              ref={ref}
              className="header-dropdown-list"
              onMouseEnter={() => toggleDropdown(true)}
              onMouseLeave={() => toggleDropdown(false)}
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
          );
        }}
      />
    );
  }

  return null;
};

AdminHeaderUser.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string,
    role: PropTypes.string,
    photo: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

export default AdminHeaderUser;
