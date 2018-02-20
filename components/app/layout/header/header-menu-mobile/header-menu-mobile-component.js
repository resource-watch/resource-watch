import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Next
import { Link } from 'routes';

// Components
import Icon from 'components/ui/Icon';

export default class HeaderMenuMobile extends React.PureComponent {
  static propTypes = {
    header: PropTypes.object,
    routes: PropTypes.object,
    // Actions
    setMobileOpened: PropTypes.func
  }

  static defaultProps = {
    header: {},
    routes: {},
    setMobileOpened: () => {}
  }

  componentDidUpdate() {
    const { header } = this.props;

    document.body.classList.toggle('no-scroll', header.mobileOpened);
  }

  render() {
    const { header, routes, setMobileOpened } = this.props;

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

            <ul>
              {header.items.map((item) => {
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
                      <a
                        href={item.href}
                      >
                        {item.label}
                      </a>
                    }


                    {item.children &&
                      <ul>
                        {item.children.map(c => (
                          <li key={c.route}>
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
