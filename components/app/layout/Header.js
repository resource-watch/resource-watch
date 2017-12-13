/* eslint no-return-assign: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import MediaQuery from 'react-responsive';

// Next
import { Link } from 'routes';

// Components
import HeaderDropdownData from 'components/app/layout/header/HeaderDropdownData';
import HeaderDropdownAbout from 'components/app/layout/header/HeaderDropdownAbout';
import HeaderUser from 'components/app/layout/header/HeaderUser';
import HeaderSearch from 'components/app/layout/header/HeaderSearch';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataActive: false,
      aboutActive: false,
      myrwActive: false
    };

    this.listeners = {};

    // BINDINGS
    this.toggleDropdown = debounce(this.toggleDropdown.bind(this), 50);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.pageHeader !== this.props.pageHeader
      || !isEqual(nextProps.user, this.props.user)
      || !isEqual(nextProps.url, this.props.url)
      || !isEqual(nextState, this.state);
  }

  // This function is debounced. If you don't do that insane things will happen
  toggleDropdown(specificDropdown, to) {
    this.setState({
      ...{ dataActive: false, aboutActive: false, myrwActive: false },
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
        name: 'Blog',
        pathnames: ['/app/Insights'],
        component: <Link route="insights"><a>Blog</a></Link>
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
        name: 'Search',
        pathnames: [],
        component: <HeaderSearch />
      },
      {
        name: 'Personal Area',
        component: <HeaderUser
          user={this.props.user}
          active={this.state.myrwActive}
          onMouseEnter={() => this.toggleDropdown('myrwActive', true)}
          onMouseLeave={() => this.toggleDropdown('myrwActive', false)}
        />
      }
    ];

    const headerClass = classnames({
      '-transparent': pageHeader
    });

    return (
      <header className={`l-header ${headerClass}`}>
        {/* <div className="header-secondary"></div> */}
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <div className="header-main">
                <div className="header-logo">
                  <Link route="home">
                    <a>
                      <svg className="brand-logo"><use xlinkHref="#icon-logo" /></svg>
                      <h1 className="brand-title">Resource Watch</h1>
                      <div className="brand-beta">beta</div>
                    </a>
                  </Link>
                </div>
                <MediaQuery minDeviceWidth={720} values={{ deviceWidth: 720 }}>
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
                </MediaQuery>
              </div>
            </div>
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
  user: PropTypes.object,
  url: PropTypes.object,
  pageHeader: PropTypes.bool
};

export default Header;
