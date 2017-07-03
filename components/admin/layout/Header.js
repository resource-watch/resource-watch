import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Next components
import { Link } from 'routes';

export default class Header extends React.Component {

  static propTypes() {
    return {
      session: PropTypes.object.isRequired
    };
  }

  render() {
    const { url } = this.props;

    const items = [
      {
        name: 'Data',
        pathnames: ['/admin/Data', '/admin/DataDetail'],
        component: <Link route="admin_data" params={{ tab: 'data', subtab: 'edit' }}><a>Data</a></Link>
      },
      {
        name: 'Pages',
        pathnames: ['/admin/Pages'],
        component: <Link route="admin_pages"><a>Pages</a></Link>
      },
      {
        name: 'Users',
        pathnames: ['/admin/Users'],
        component: <Link route="admin_users"><a>Users</a></Link>
      },
      {
        name: 'Partners',
        pathnames: ['/admin/Partners'],
        component: <Link route="admin_partners"><a>Partners</a></Link>
      },
      {
        name: 'Logout',
        component: <a href="/logout">Log out</a>
      }
    ];

    return (
      <header className="c-header -transparent">
        <div className="header-secondary">
          {/* We will load the script generated */}
        </div>
        <div className="l-container">
          <div className="header-main">
            <h1 className="header-logo">
              <Link route="admin_home">
                <a>
                  <svg><use xlinkHref="#icon-logo" /></svg>
                  <span>Resource Watch Content Manager</span>
                </a>
              </Link>
            </h1>
            <nav className="header-menu">
              <ul>
                {items.map((item) => {
                  const activeClassName = classnames({
                    '-active': item.pathnames && item.pathnames.includes(url.pathname)
                  });

                  return (
                    <li key={item.name} className={activeClassName}>
                      {item.component}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </header>
    );
  }
}

Header.defaultProps = {
  url: {}
};


Header.propTypes = {
  url: PropTypes.object
};
