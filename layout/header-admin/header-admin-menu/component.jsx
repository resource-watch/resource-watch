import React, {
  createElement,
} from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import classnames from 'classnames';

// components
import HeaderUser from 'layout/header-admin/header-admin-user';

// constants
import { ADMIN_HEADER_ITEMS } from 'layout/header-admin/constants';

const headerComponents = { myrw: HeaderUser };

const AdminHeaderMenu = () => {
  const {
    pathname,
  } = useRouter();

  return (
    <nav className="header-menu">
      <ul>
        {ADMIN_HEADER_ITEMS.map((item) => {
          const activeClassName = classnames({ '-active': item.pages && item.pages.includes(pathname) });
          const DropdownMenu = headerComponents[item.id];

          return (
            <li
              key={item.label}
              className={activeClassName}
            >
              {!DropdownMenu && item.href
                && (
                <Link href={item.href}>
                  <a>{item.label}</a>
                </Link>
                )}

              {DropdownMenu && createElement(DropdownMenu)}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default AdminHeaderMenu;
