import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import debounce from 'lodash/debounce';

// Next components
import { Link } from 'routes';

// Components
import HeaderUser from 'components/app/layout/header/header-user';

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      myrwActive: false
    };

    this.listeners = {};

    // BINDINGS
    this.toggleDropdown = debounce(this.toggleDropdown.bind(this), 50);
  }

  // This function is debounced. If you don't do that insane things will happen
  toggleDropdown(specificDropdown, to) {
    this.setState({
      ...{ myrwActive: false },
      [specificDropdown]: to
    });
  }


  render() {
    const { url } = this.props;

    const items = [
      {
        name: 'Data',
        pathnames: ['/admin/Data', '/admin/DataDetail'],
        component: <Link route="admin_data"><a>Data</a></Link>
      },
      {
        name: 'Dashboards',
        pathnames: ['/admin/Dashboards', '/admin/DashboardsDetail'],
        component: <Link route="admin_dashboards"><a>Dashboards</a></Link>
      },
      {
        name: 'Partners',
        pathnames: ['/admin/Partners', '/admin/PartnersDetail'],
        component: <Link route="admin_partners"><a>Partners</a></Link>
      },
      {
        name: 'Tools',
        pathnames: ['/admin/Tools', '/admin/ToolsDetail'],
        component: <Link route="admin_tools"><a>Tools</a></Link>
      },
      {
        name: 'FAQs',
        pathnames: ['/admin/Faqs', '/admin/FaqsDetail'],
        component: <Link route="admin_faqs"><a>FAQs</a></Link>
      },
      {
        name: 'Pages',
        pathnames: ['/admin/Pages', '/admin/PagesDetail'],
        component: <Link route="admin_pages"><a>Pages</a></Link>
      },
      {
        name: 'My RW',
        component: <HeaderUser
          active={this.state.myrwActive}
          onMouseEnter={() => this.toggleDropdown('myrwActive', true)}
          onMouseLeave={() => this.toggleDropdown('myrwActive', false)}
        />
      }
    ];

    return (
      <header className="l-header -transparent">
        <div className="header-secondary">
          {/* We will load the script generated */}
        </div>
        <div className="l-container -admin">
          <div className="row">
            <div className="column small-12">
              <div className="header-main">
                <div className="header-logo -main">
                  <Link route="home">
                    <a>
                      <svg className="brand-logo"><use xlinkHref="#icon-logo" /></svg>
                      <h1 className="brand-title">Resource Watch</h1>
                      <div className="brand-beta">beta</div>
                    </a>
                  </Link>
                </div>
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
