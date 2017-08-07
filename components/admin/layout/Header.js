import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import debounce from 'lodash/debounce';

// Next components
import { Link } from 'routes';

// Components
import HeaderUser from 'components/app/layout/header/HeaderUser';

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
        name: 'Pages',
        pathnames: ['/admin/Pages', '/admin/PagesDetail'],
        component: <Link route="admin_pages"><a>Pages</a></Link>
      },
      {
        name: 'Partners',
        pathnames: ['/admin/Partners', '/admin/PartnersDetail'],
        component: <Link route="admin_partners"><a>Partners</a></Link>
      },
      {
        name: 'My RW',
        component: <HeaderUser
          user={this.props.user}
          active={this.state.myrwActive}
          onMouseEnter={() => this.toggleDropdown('myrwActive', true)}
          onMouseLeave={() => this.toggleDropdown('myrwActive', false)}
        />
      }
    ];

    return (
      <header className="c-header -transparent">
        <div className="header-secondary">
          {/* We will load the script generated */}
        </div>
        <div className="l-container">
          <div className="header-main">
            <h1 className="header-logo -admin">
              <Link route="admin_home">
                <a>
                  <svg><use xlinkHref="#icon-logo-cms" /></svg>
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
  url: PropTypes.object,
  user: PropTypes.object
};
