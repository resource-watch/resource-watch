import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'routes';

// components
import HeaderUser from 'layout/header-admin/header-admin-user';

// constants
import { ADMIN_HEADER_ITEMS } from 'layout/header-admin/constants';

class AdminHeaderMenu extends PureComponent {
  static propTypes = { routes: PropTypes.object.isRequired }

  headerComponents = { myrw: <HeaderUser /> }

  render() {
    const { routes: { pathname } } = this.props;

    return (
      <nav className="header-menu">
        <ul>
          {ADMIN_HEADER_ITEMS.map((item) => {
            const activeClassName = classnames({ '-active': item.pathnames && item.pathnames.includes(pathname) });
            const component = this.headerComponents[item.id];

            return (
              <li
                key={item.label}
                className={activeClassName}
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
                  </a>}

                {!!component && component}
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}

export default AdminHeaderMenu;
