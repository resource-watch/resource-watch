import { createElement } from 'react';
import classnames from 'classnames';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/client';

// components
import { APP_HEADER_ITEMS } from 'layout/header/constants';

const header = {
  about: import('../header-about'),
  dashboards: import('../header-dashboards'),
  data: import('../header-data'),
  'get-involved': import('../header-get-involved'),
  menu: import('../header-menu'),
  'menu-mobile': import('../header-menu-mobile'),
  search: import('../header-search'),
  user: import('../header-user'),
};

const HeaderMenu = () => {
  const { pathname } = useRouter();
  const [session] = useSession();

  return (
    <nav className="header-menu">
      <ul>
        {APP_HEADER_ITEMS.map((item) => {
          const isUserLogged = !!session?.accessToken;

          // if user is defined but it is not equal to the current token
          if (typeof item.user !== 'undefined' && item.user !== isUserLogged) return null;

          let DropdownMenu;
          if (item.id !== 'blog') {
            DropdownMenu = dynamic(() => header[item.id]);
          }

          return (
            <li
              key={item.label}
              className={classnames({
                '-active': pathname.startsWith(item.root),
              })}
            >
              {!DropdownMenu && item.href && !item.external && (
                <Link href={item.href}>
                  <a>{item.label}</a>
                </Link>
              )}

              {!DropdownMenu && item.external && <a href={item.href}>{item.label}</a>}

              {DropdownMenu && createElement(DropdownMenu, item)}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default HeaderMenu;
