import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import debounce from 'lodash/debounce';

// Next
import { Link } from 'routes';

// Components
import HeaderDropdownData from 'components/app/layout/header/HeaderDropdownData';
import HeaderDropdownAbout from 'components/app/layout/header/HeaderDropdownAbout';
import HeaderUser from 'components/app/layout/header/HeaderUser';

class Header extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dataActive: false,
      aboutActive: false
    };

    this.listeners = {};

    // BINDINGS
    this.toggleDropdown = debounce(this.toggleDropdown.bind(this), 50);
  }

  // This function is debounced. If you don't do that insane things will happen
  toggleDropdown(specificDropdown, to) {
    this.setState({
      ...{ dataActive: false, aboutActive: false },
      [specificDropdown]: to
    });
  }

  render() {
    // TODO: improve pathnames behaviour
    const { pageHeader, url } = this.props;

    const items = [
      {
        name: 'Data',
        pathnames: ['/app/Explore', '/app/ExploreDetail', '/app/Pulse'],
        component: <HeaderDropdownData
          active={this.state.dataActive}
          onMouseEnter={() => this.toggleDropdown('dataActive', true)}
          onMouseLeave={() => this.toggleDropdown('dataActive', false)}
        />
      },
      {
        name: 'Insights',
        pathnames: ['/app/Insights'],
        component: <Link route="insights"><a>Insights</a></Link>
      },
      {
        name: 'About',
        pathnames: ['/app/About'],
        component: <HeaderDropdownAbout
          active={this.state.aboutActive}
          onMouseEnter={() => this.toggleDropdown('aboutActive', true)}
          onMouseLeave={() => this.toggleDropdown('aboutActive', false)}
        />
      },
      {
        name: 'Get Involved',
        pathnames: ['/app/GetInvolved'],
        component: <Link route="get_involved"><a>Get Involved</a></Link>
      },
      {
        name: 'My RW',
        component: <HeaderUser />
      }
    ];

    const headerClass = classnames({
      '-transparent': pageHeader
    });

    return (
      <header className={`c-header ${headerClass}`}>
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
  url: {},
  pageHeader: false
};


Header.propTypes = {
  url: PropTypes.object,
  pageHeader: PropTypes.bool
};

export default Header;
