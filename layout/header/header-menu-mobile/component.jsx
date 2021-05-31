import {
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toastr } from 'react-redux-toastr';

// components
import Icon from 'components/ui/icon';
import SearchMobile from 'layout/header/search-mobile';

// constants
import { APP_HEADER_ITEMS } from 'layout/header/constants';

// styles
import './styles.scss';

const HeaderMenuMobile = ({
  header,
  user,
  setMobileOpened,
}) => {
  const {
    pathname,
  } = useRouter();

  const logout = (e) => {
    if (e) e.preventDefault();

    // Get to logout
    fetch(`${process.env.NEXT_PUBLIC_WRI_API_URL}/auth/logout`, { credentials: 'include' })
      .then(() => { window.location.href = `/logout?callbackUrl=${window.location.href}`; })
      .catch((err) => { toastr.error('Error', err); });
  };

  const {
    mobileOpened,
  } = header;
  const {
    role,
    token,
  } = user;
  const classNames = classnames({ '-opened': mobileOpened });

  useEffect(() => {
    document.body.classList.toggle('no-scroll', mobileOpened);
  }, [mobileOpened]);

  return (
    <div className="c-header-menu-mobile">
      <button
        className="c-button -secondary -alt -compressed header-burger-button"
        onClick={() => setMobileOpened(true)}
      >
        Menu
      </button>

      <div className={`header-menu-mobile-content ${classNames}`}>
        {/* Backdrop */}
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          className={`c-button -clean header-menu-mobile-backdrop ${classNames}`}
          onClick={() => setMobileOpened(false)}
        />

        {/* Nav */}
        <nav className={`header-menu-mobile-nav ${classNames}`}>
          <button
            className="c-button -secondary -compressed -square header-close-button"
            onClick={() => setMobileOpened(false)}
          >
            <Icon name="icon-cross" className="-smaller" />
          </button>

          <SearchMobile />

          <ul>
            {APP_HEADER_ITEMS.map((item) => {
              const isUserLogged = !!token;
              const isUserAdmin = isUserLogged && role === 'ADMIN';

              // If user is defined and is not equal to the current token
              if (typeof item.user !== 'undefined' && item.user !== isUserLogged) return null;

              // If admin user is defined and is not equal to the current token
              if (typeof item.admin !== 'undefined' && item.admin !== isUserAdmin) return null;

              const activeClassName = classnames({ '-active': item.pages && item.pages.includes(pathname) });

              return (
                <li
                  key={item.label}
                  className={activeClassName}
                >
                  {(item.href && !item.external) && (
                    <h2>
                      <Link
                        href={item.href}
                        // route={item.route}
                        // params={item.params}
                      >
                        <a>{item.label}</a>
                      </Link>
                    </h2>
                  )}

                  {(item.href && item.external) && (
                    <h2>
                      <a href={item.href}>
                        {item.label}
                      </a>
                    </h2>
                  )}

                  {!item.href && (<h2>{item.label}</h2>)}

                  {item.children
                    && (
                    <ul>
                      {item.children.map((c) => {
                        // If user is defined and is not equal to the current token
                        if (typeof c.user !== 'undefined' && c.user !== isUserLogged) {
                          return null;
                        }

                        // If admin user is defined and is not equal to the current token
                        if (typeof c.admin !== 'undefined' && c.admin !== isUserAdmin) {
                          return null;
                        }

                        return (
                          <li key={c.label}>
                            {c.href && (
                              <Link
                                href={c.href}
                                // route={c.route}
                                // params={c.params}
                              >
                                <a>{c.label}</a>
                              </Link>
                            )}

                            {(c.href && c.external) && (
                              <a href={c.href}>
                                {c.label}
                              </a>
                            )}

                            {c.id === 'logout' && (
                              <a
                                href={c.href}
                                onClick={logout}
                              >
                                {c.label}
                              </a>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                    )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

HeaderMenuMobile.propTypes = {
  header: PropTypes.shape({
    mobileOpened: PropTypes.bool.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    token: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
  setMobileOpened: PropTypes.func.isRequired,
};

export default HeaderMenuMobile;
