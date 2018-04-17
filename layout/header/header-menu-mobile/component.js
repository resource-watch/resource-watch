import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Next
import { Link } from 'routes';

import { toastr } from 'react-redux-toastr';

// Components
import Icon from 'components/ui/Icon';
import SearchMobile from 'layout/header/search-mobile';

export default class HeaderMenuMobile extends React.PureComponent {
  static propTypes = {
    header: PropTypes.object,
    routes: PropTypes.object,
    user: PropTypes.object,

    // Actions
    setMobileOpened: PropTypes.func
  }

  static defaultProps = {
    header: {},
    routes: {},
    user: {},
    setMobileOpened: () => {}
  }

  componentDidUpdate() {
    const { header } = this.props;

    document.body.classList.toggle('no-scroll', header.mobileOpened);
  }

  /**
   * UI EVENTS
   * - logout
  */
  logout(e) {
    if (e) {
      e.preventDefault();
    }

    // Get to logout
    fetch(`${process.env.CONTROL_TOWER_URL}/auth/logout`, {
      credentials: 'include'
    })
      .then(() => {
        window.location.href = `/logout?callbackUrl=${window.location.href}`;
      })
      .catch((err) => {
        toastr.error('Error', err);
      });
  }

  render() {
    const {
      header, routes, user, setMobileOpened
    } = this.props;

    const classNames = classnames({
      '-opened': header.mobileOpened
    });

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
              {header.items.map((item) => {
                const isUserLogged = !!user.token;
                const isUserAdmin = isUserLogged && user.role === 'ADMIN';

                // If user is defined and is not equal to the current token
                if (typeof item.user !== 'undefined' && item.user !== isUserLogged) {
                  return null;
                }

                // If admin user is defined and is not equal to the current token
                if (typeof item.admin !== 'undefined' && item.admin !== !isUserAdmin) {
                  return null;
                }


                const activeClassName = classnames({
                  '-active': item.pathnames && item.pathnames.includes(routes.pathname)
                });

                return (
                  <li
                    key={item.label}
                    className={activeClassName}
                  >
                    {item.route &&
                      <h2>
                        <Link
                          route={item.route}
                          params={item.params}
                        >
                          <a>{item.label}</a>
                        </Link>
                      </h2>
                    }

                    {item.href &&
                      <h2>
                        <a
                          href={item.href}
                        >
                          {item.label}
                        </a>
                      </h2>
                    }

                    {!item.route && !item.href &&
                      <h2>{item.label}</h2>
                    }


                    {item.children &&
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
                              {!!c.route &&
                                <Link
                                  route={c.route}
                                  params={c.params}
                                >
                                  <a>{c.label}</a>
                                </Link>
                              }

                              {!!c.href &&
                                <a
                                  href={c.href}
                                >
                                  {c.label}
                                </a>
                              }

                              {c.id === 'logout' &&
                                <a
                                  onClick={this.logout}
                                  href={c.href}
                                >
                                  {c.label}
                                </a>
                              }
                            </li>
                          );
                        })}
                      </ul>
                    }
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}
