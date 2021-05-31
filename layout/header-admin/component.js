import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Link from 'next/link';

// components
import HeaderMenu from 'layout/header-admin/header-admin-menu';
import HeaderMenuMobile from 'layout/header-admin/header-admin-menu-mobile';
import Icon from 'components/ui/icon';

// lib
import {
  Media,
} from 'lib/media';

class AdminHeader extends PureComponent {
  static propTypes = {
    header: PropTypes.object.isRequired,
    pageHeader: PropTypes.bool,
  };

  static defaultProps = { pageHeader: false };

  render() {
    const {
      header: { admin },
      pageHeader,
    } = this.props;
    const headerClass = classnames(
      'l-header',
      { '-transparent': pageHeader },
    );
    const containerClass = classnames(
      'l-container',
      { '-admin': admin },
    );

    return (
      <header className={headerClass}>
        <div className={containerClass}>
          <div className="row">
            <div className="column">
              <div className="header-main">
                <div className="header-logo">
                  <Link href="/">
                    <a>
                      <Icon name="icon-rw-logo" className="brand-logo" />
                      <h1 className="brand-title">Resource Watch</h1>
                    </a>
                  </Link>
                </div>
                <Media
                  at="sm"
                >
                  <HeaderMenuMobile />
                </Media>
                <Media
                  greaterThanOrEqual="md"
                >
                  <HeaderMenu />
                </Media>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default AdminHeader;
