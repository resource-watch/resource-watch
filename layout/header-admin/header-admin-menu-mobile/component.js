import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'routes';

// components
import Icon from 'components/ui/icon';

// constants
import { ADMIN_HEADER_ITEMS } from 'layout/header-admin/constants';

class AdminHeaderMenuMobile extends PureComponent {
  static propTypes = {
    header: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
    setMobileOpened: PropTypes.func.isRequired
  }

  componentDidUpdate() {
    const { header: { mobileOpened } } = this.props;

    document.body.classList.toggle('no-scroll', mobileOpened);
  }

  render() {
    const {
      header: { mobileOpened },
      routes: { pathname },
      setMobileOpened
    } = this.props;
    const classNames = classnames({ '-opened': mobileOpened });

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

            <ul>
              {ADMIN_HEADER_ITEMS.map((item) => {
                const activeClassName = classnames({ '-active': item.pathnames && item.pathnames.includes(pathname) });

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
                      <a href={item.href}>
                        {item.label}
                      </a>}

                    {item.children &&
                      <ul>
                        {item.children.map(c => (
                          <li key={c.route || c.href}>
                            {!!c.route &&
                              <Link
                                route={c.route}
                                params={c.params}
                              >
                                <a>{c.label}</a>
                              </Link>
                            }

                            {!!c.href &&
                              <a href={c.href}>
                                {c.label}
                              </a>
                            }
                          </li>
                         ))}
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

export default AdminHeaderMenuMobile;
