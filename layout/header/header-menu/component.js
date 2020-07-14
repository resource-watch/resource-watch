import React, { PureComponent, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'routes';

// components
import HeaderData from 'layout/header/header-data';
import HeaderAbout from 'layout/header/header-about';
import HeaderSearch from 'layout/header/header-search';
import HeaderUser from 'layout/header/header-user';
import HeaderDashboards from 'layout/header/header-dashboards';
import HeaderGetInvolved from 'layout/header/header-get-involved';

// constants
import { APP_HEADER_ITEMS } from 'layout/header/constants';

// Utils
import { logEvent } from 'utils/analytics';

class HeaderMenu extends PureComponent {
  static propTypes = {
    routes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  }

  headerComponents = {
    data: <HeaderData />,
    about: <HeaderAbout />,
    dashboards: <HeaderDashboards />,
    myrw: <HeaderUser />,
    search: <HeaderSearch />,
    get_involved: <HeaderGetInvolved />
  }

  render() {
    const {
      user: { token },
      routes
    } = this.props;

    return (
      <nav className="header-menu">
        <ul>
          {APP_HEADER_ITEMS.map((item) => {
            const isUserLogged = !!token;

            // if user is defined but it is not equal to the current token
            if (typeof item.user !== 'undefined' && item.user !== isUserLogged) return null;

            const activeClassName = classnames({ '-active': item.pathnames && item.pathnames.includes(routes.pathname) });
            const component = this.headerComponents[item.id];
            
            return (
              <li
                key={item.label}
                className={activeClassName}
                onClick={() => {
                  if (item.label === 'App Gallery') {
                    logEvent('App Gallery Link Clicked', 'Header');
                  }
                }}
              >
                {!component && item.route &&
                  <Link
                    route={item.route}
                    params={item.params}
                  >
                    <a>{item.label}</a>
                  </Link>
                }

                {!component && item.href &&
                  <a href={item.href}>
                    {item.label}
                  </a>
                }

                {!!component && cloneElement(component, item)}
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}

export default HeaderMenu;
