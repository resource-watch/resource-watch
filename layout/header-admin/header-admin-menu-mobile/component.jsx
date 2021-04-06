import React, {
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useRouter } from 'next/router';
import Link from 'next/link';

// components
import Icon from 'components/ui/icon';

// constants
import { ADMIN_HEADER_ITEMS } from 'layout/header-admin/constants';

const AdminHeaderMenuMobile = ({
  header,
  setMobileOpened,
}) => {
  const {
    pathname,
  } = useRouter();
  const {
    mobileOpened,
  } = header;

  useEffect(() => {
    document.body.classList.toggle('no-scroll', mobileOpened);
  }, [mobileOpened]);

  const classNames = classnames({ '-opened': mobileOpened });

  return (
    <div className="c-header-menu-mobile">
      <button
        className="c-button -secondary -alt -compressed header-burger-button"
        onClick={() => setMobileOpened(true)}
      >
        Menu
      </button>

      <div className={`header-menu-mobile-content ${classNames}`}>
        {/* Backdrop */}
        <button
          className={`c-button -clean header-menu-mobile-backdrop ${classNames}`}
          onClick={() => setMobileOpened(false)}
        />

        {/* Nav */}
        <nav className={`header-menu-mobile-nav ${classNames}`}>
          <button
            className="c-button -secondary -compressed -square header-close-button"
            onClick={() => setMobileOpened(false)}
          >
            <Icon name="icon-cross" className="-smaller" />
          </button>

          <ul>
            {ADMIN_HEADER_ITEMS.map((item) => {
              const activeClassName = classnames({ '-active': item.pages && item.pages.includes(pathname) });

              return (
                <li
                  key={item.label}
                  className={activeClassName}
                >
                  {item.href && (
                    <h2>
                      <Link href={item.href}>
                        <a>{item.label}</a>
                      </Link>
                    </h2>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

AdminHeaderMenuMobile.propTypes = {
  header: PropTypes.shape({
    mobileOpened: PropTypes.bool.isRequired,
  }).isRequired,
  setMobileOpened: PropTypes.func.isRequired,
};

export default AdminHeaderMenuMobile;
