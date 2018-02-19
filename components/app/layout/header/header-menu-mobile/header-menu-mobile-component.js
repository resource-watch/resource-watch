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
    setMobileOpened: PropTypes.func9
  }

  static defaultProps = {
    header: {},
    routes: {},
    setMobileOpened: () => {}
  }

  render() {
    const { header, routes, setMobileOpened } = this.props;

    const navClassNames = classnames({
      '-opened': header.mobileOpened
    });

    return (
      <div className="c-header-menu-mobile">
        <button
          className="c-button -secondary -alt -compressed header-burger-menu"
          onClick={() => setMobileOpened(true)}
        >
          Menu
        </button>

        <nav className={`header-menu-mobile-nav ${navClassNames}`}>
          <button
            className="c-button -secondary -compressed -square"
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
                        <li>
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
    );
  }
}
