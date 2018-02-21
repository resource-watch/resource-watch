/* eslint no-return-assign: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Responsive
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';

// Next
import { Link } from 'routes';

// Components
import HeaderMenu from 'components/layout/header-admin/header-admin-menu';
import HeaderMenuMobile from 'components/layout/header-admin/header-admin-menu-mobile';

class Header extends React.PureComponent {
  static defaultProps = {
    header: {},
    pageHeader: false
  };

  static propTypes = {
    header: PropTypes.object,
    responsive: PropTypes.object,
    pageHeader: PropTypes.bool
  };

  render() {
    const { header, pageHeader } = this.props;

    const headerClass = classnames({
      '-transparent': pageHeader
    });

    const containerClass = classnames({
      '-admin': header.admin
    });

    return (
      <header className={`l-header ${headerClass}`}>
        {/* <div className="header-secondary"></div> */}
        <div className={`l-container ${containerClass}`}>
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
                  <HeaderMenuMobile />
                </MediaQuery>

                {/* Desktop header */}
                <MediaQuery
                  minDeviceWidth={breakpoints.medium}
                  values={{ deviceWidth: this.props.responsive.fakeWidth }}
                >
                  <HeaderMenu />
                </MediaQuery>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
