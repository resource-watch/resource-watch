import {
  useState,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Tether from 'react-tether';
import { useDebouncedCallback } from 'use-debounce';
import { signOut } from 'next-auth/client';

// hooks
import {
  useMe,
} from 'hooks/user';

// components
import Icon from 'components/ui/icon';

const HeaderUser = () => {
  const [isVisible, setVisibility] = useState(false);
  const {
    data: user,
  } = useMe();
  const {
    asPath,
  } = useRouter();

  const logout = async (e) => {
    if (e) e.preventDefault();
    signOut();
  };

  const [toggleDropdown] = useDebouncedCallback((_isVisible) => {
    setVisibility(_isVisible);
  }, 50);

  const {
    photo,
    role,
    email,
  } = user || {};

  if (user) {
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
    <Link href={`/sign-in?callbackUrl=${asPath}`}>
      <a className="header-menu-link">
        <Icon
          name="icon-user"
          className="-medium user-icon"
        />
      </a>
    </Link>
  );
};

export default HeaderUser;
