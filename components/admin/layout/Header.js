import { Link } from 'routes';
import React from 'react';

export default class Header extends React.Component {

  static propTypes() {
    return {
      session: React.PropTypes.object.isRequired
    };
  }

  render() {
      // <li><Link route="logout"><a>Logout</a></Link></li>
    return (
      <header className="l-header c-header">
        <div className="row collapse">
          <div className="column">
            <Link route="admin_home"><a><img alt="" src="/static/images/logo.png" /></a></Link>
          </div>
          <ul className="menu">
            <li><Link route="datasets"><a>Datasets</a></Link></li>
            <li><Link route="partners"><a>Partners</a></Link></li>
            <li><Link route="pages"><a>Pages</a></Link></li>
            <li><Link route="insights"><a>Insights</a></Link></li>
            <li><Link route="vocabularies"><a>Vocabularies</a></Link></li>
          </ul>
        </div>
      </header>
    );
  }

  render() {
    const items = [
      {
        name: 'Data',
        component: <Link route="admin_data" params={{ tab: 'data', subtab: 'edit' }}><a>Data</a></Link>
      },
      {
        name: 'Pages',
        component: <Link route="admin_pages"><a>Insights</a></Link>
      },
      {
        name: 'Users',
        component: <Link route="admin_users"><a>Insights</a></Link>
      },
      {
        name: 'Partners',
        component: <Link route="admin_partners"><a>Get Involved</a></Link>
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
                  <span>Resource Watch</span>
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
