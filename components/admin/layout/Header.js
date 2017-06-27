import { Link } from 'routes';
import React from 'react';

export default class Header extends React.Component {

  static propTypes() {
    return {
      session: React.PropTypes.object.isRequired
    };
  }

  render() {
    const items = [
      {
        name: 'Data',
        component: <Link route="admin_data" params={{ tab: 'data', subtab: 'edit' }}><a>Data</a></Link>
      },
      {
        name: 'Pages',
        component: <Link route="admin_pages"><a>Pages</a></Link>
      },
      {
        name: 'Users',
        component: <Link route="admin_users"><a>Users</a></Link>
      },
      {
        name: 'Partners',
        component: <Link route="admin_partners"><a>Partners</a></Link>
      },
      {
        name: 'Logout',
        component: <Link route="logout"><a>Log out</a></Link>
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
              <Link route="home">
                <a>
                  <svg><use xlinkHref="#icon-logo" /></svg>
                  <span>Resource Watch Content Manager</span>
                </a>
              </Link>
            </h1>
            <nav className="header-menu">
              <ul>
                {items.map(item => (
                  <li key={item.name}>
                    {item.component}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>
    );
  }
}
