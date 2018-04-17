import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Next
import { Link } from 'routes';

// Components
import HeaderData from 'layout/header/header-data';
import HeaderAbout from 'layout/header/header-about';
import HeaderSearch from 'layout/header/header-search';
import HeaderUser from 'layout/header/header-user';
import HeaderTopics from 'layout/header/header-topics';
import HeaderGetInvolved from 'layout/header/header-get-involved';

export default class HeaderMenu extends React.PureComponent {
  static propTypes = {
    header: PropTypes.object,
    routes: PropTypes.object,
    user: PropTypes.object
  }

  static defaultProps = {
    header: {},
    routes: {},
    user: {}
  }

  headerComponents = {
    data: <HeaderData />,
    about: <HeaderAbout />,
    topics: <HeaderTopics />,
    myrw: <HeaderUser />,
    search: <HeaderSearch />,
    get_involved: <HeaderGetInvolved />
  }

  render() {
    const { header, user, routes } = this.props;

    return (
      <nav className="header-menu">
        <ul>
          {header.items.map((item) => {
            // If user is defined and is not equal to the current token
            if (typeof item.user !== 'undefined' && item.user !== !!user.token) {
              return null;
            }

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
                  React.cloneElement(
                    component,
                    item
                  )
                }
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}
