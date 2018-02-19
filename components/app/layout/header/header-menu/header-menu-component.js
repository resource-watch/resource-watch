import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Next
import { Link } from 'routes';

// Components
import HeaderData from 'components/app/layout/header/header-data';
import HeaderAbout from 'components/app/layout/header/header-about';
import HeaderSearch from 'components/app/layout/header/header-search';
import HeaderUser from 'components/app/layout/header/header-user';

export default class HeaderMenu extends React.PureComponent {
  static propTypes = {
    header: PropTypes.object,
    routes: PropTypes.object
  }

  static defaultProps = {
    header: {},
    routes: {}
  }

  headerComponents = {
    data: <HeaderData />,
    about: <HeaderAbout />,
    myrw: <HeaderUser />,
    search: <HeaderSearch />
  }

  render() {
    const { header, routes } = this.props;

    return (
      <nav className="header-menu">
        <ul>
          {header.items.map((item) => {
            const activeClassName = classnames({
              '-active': item.pathnames && item.pathnames.includes(routes.pathname)
            });

            const component = this.headerComponents[item.id];

            return (
              <li key={item.label} className={activeClassName}>
                {!component && item.route &&
                  <Link
                    route={item.route}
                    params={item.params}
                  >
                    <a>{item.label}</a>
                  </Link>
                }

                {!component && item.href &&
                  <a
                    href={item.href}
                  >
                    {item.label}
                  </a>
                }

                {!!component &&
                  component
                }
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}
