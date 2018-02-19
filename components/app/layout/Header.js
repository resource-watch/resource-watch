/* eslint no-return-assign: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';

// Responsive
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';

// Connect
import { connect } from 'react-redux';

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
      myrwActive: false,
      mobileOpened: false
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

  triggerClickMobileMenu = () => {
    this.setState({
      mobileOpened: !this.state.mobileOpened
    });
  }

  render() {
    // TODO: improve pathnames behaviour
    const { pageHeader, url } = this.props;

    const items = [
      {
        label: 'Data',
        route: 'data',
        pathnames: ['/app/Explore', '/app/ExploreDetail', '/app/Pulse'],
        children: [
          { label: 'Explore Datasets', route: 'explore' },
          { label: 'Dashboards', route: 'dashboards' },
          { label: 'Planet Pulse', href: '/data/pulse' },
          { label: 'Planet Pulse', route: 'get_involved_detail', params: { id: 'apps' } }
        ],
        component: <HeaderDropdownData
          active={this.state.dataActive}
          onMouseEnter={() => this.toggleDropdown('dataActive', true)}
          onMouseLeave={() => this.toggleDropdown('dataActive', false)}
        />
      },
      {
        label: 'Blog',
        route: 'insights',
        pathnames: ['/app/Insights'],
        component: <Link route="insights"><a>Blog</a></Link>
      },
      {
        label: 'About',
        route: 'about',
        pathnames: ['/app/About'],
        children: [
          { label: 'Partners', route: 'about_partners' },
          { label: 'FAQs', route: 'about_faqs' },
          { label: 'How to', route: 'about_howto' },
          { label: 'Contact us', route: 'about_contact-us' }
        ],
        component: <HeaderDropdownAbout
          active={this.state.aboutActive}
          onMouseEnter={() => this.toggleDropdown('aboutActive', true)}
          onMouseLeave={() => this.toggleDropdown('aboutActive', false)}
        />
      },
      {
        label: 'Get Involved',
        route: 'get_involved',
        pathnames: ['/app/GetInvolved'],
        component: <Link route="get_involved"><a>Get Involved</a></Link>
      },
      {
        label: 'Search',
        pathnames: [],
        component: <HeaderSearch />
      },
      {
        label: 'Personal Area',
        route: 'myrw',
        component: <HeaderUser
          active={this.state.myrwActive}
          onMouseEnter={() => this.toggleDropdown('myrwActive', true)}
          onMouseLeave={() => this.toggleDropdown('myrwActive', false)}
        />
      }
    ];

    const headerClass = classnames({
      '-transparent': pageHeader
    });

    const mobileOpenedClass = classnames({
      '-open': this.state.mobileOpened
    })

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

                {/* Mobile header */}
                <MediaQuery
                  maxDeviceWidth={breakpoints.medium - 1}
                  values={{ deviceWidth: this.props.responsive.fakeWidth }}
                >
                  <button
                    className="c-button -secondary -alt -compressed header-burger-menu"
                    onClick={this.triggerClickMobileMenu}
                  >
                    Menu
                  </button>
                </MediaQuery>

                <MediaQuery
                  maxDeviceWidth={breakpoints.medium - 1}
                  values={{ deviceWidth: this.props.responsive.fakeWidth }}
                >
                  <nav className={`header-mobile-menu ${mobileOpenedClass}`}>
                    <button
                      className="c-button -secondary -alt -compressed header-burger-menu"
                      onClick={this.triggerClickMobileMenu}
                    >
                      Menu
                    </button>

                    <ul>
                      {items.map((item) => {
                        const activeClassName = classnames({
                          '-active': item.pathnames && item.pathnames.includes(url.pathname)
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
                </MediaQuery>

                {/* Desktop header */}
                <MediaQuery
                  minDeviceWidth={breakpoints.medium}
                  values={{ deviceWidth: this.props.responsive.fakeWidth }}
                >
                  <nav className="header-menu">
                    <ul>
                      {items.map((item) => {
                        const activeClassName = classnames({
                          '-active': item.pathnames && item.pathnames.includes(url.pathname)
                        });

                        return (
                          <li key={item.label} className={activeClassName}>
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
  responsive: PropTypes.object,
  pageHeader: PropTypes.bool
};

export default connect(
  state => ({
    user: state.user,
    responsive: state.responsive
  }),
  null
)(Header);
