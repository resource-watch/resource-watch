import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'routes';

const CompoundMenu = ({ items }) => {
  const menuItems = items.map(submenu => (
    <div className="c-compound-menu-item" key={submenu[0].name}>
      <ul className="submenu">
        {submenu.map((item, j) => { // eslint-disable-line arrow-body-style
          let link;
          if (item.route) {
            link = <Link route={item.route} params={item.params}><a>{item.name}</a></Link>
          }

          if (item.anchor) {
            link = <a href={item.anchor}>{item.name}</a>
          }

          if (!item.route && !item.anchor) {
            link = <a>{item.name}</a>
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

CompoundMenu.defaultProps = {
  items: []
};

export default CompoundMenu;
