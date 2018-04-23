import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'routes';

// Utils
import { logEvent } from 'utils/analytics';

const CompoundMenu = ({ items = [] }) => {
  const menuItems = items.map(submenu => (
    <div className="c-compound-menu-item" key={submenu[0].name}>
      <ul className="submenu">
        {submenu.map((item, j) => { // eslint-disable-line arrow-body-style
          let link;
          if (item.route) {
            link = <Link route={item.route} params={item.params}><a>{item.name}</a></Link>;
          }

          if (item.anchor) {
            link = (
              <a
                href={item.anchor}
                role="button"
                tabIndex={-1}
                onKeyPress={() => {
                  if (item.logEvent) {
                    logEvent('Menu link clicked', item.name);
                  }
                }}
                onClick={() => {
                  if (item.logEvent) {
                    logEvent('Menu link clicked', item.name);
                  }
              }}
              >
                {item.name}
              </a>
            );
          }

          if (!item.route && !item.anchor) {
            link = <a>{item.name}</a>;
          }

          return (
            <li key={item.name} className={classnames('item', { title: j === 0 })}>
              {j === 0 ? <h3>{link}</h3> : link}
            </li>
          );
        })}
      </ul>
    </div>
  )
  );

  return (
    <nav className="c-compound-menu">
      <div className="l-container">
        <div className="row">
          <div className="column small-12">
            <div className="c-compound-menu-wrapper">
              {menuItems}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

CompoundMenu.propTypes = {
  /* Array of arrays */
  items: PropTypes.array
};

export default CompoundMenu;
