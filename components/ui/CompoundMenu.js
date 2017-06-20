import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'routes';

const CompoundMenu = ({ items }) => {
  const menuItems = items.map(submenu => (
    <ul key={submenu[0].name} className="submenu column small-12 medium-3 large-3">
      {submenu.map((item, j) => { // eslint-disable-line arrow-body-style
        const linkParams = { route: item.route };
        const link = item.route
          ? <Link {...linkParams}><a>{item.name}</a></Link>
          : <a>{item.name}</a>;

        return (
          <li key={item.name} className={classnames('item', { title: j === 0 })}>
            {j === 0 ? <h3>{link}</h3> : link}
          </li>
        );
      })}
    </ul>
    )
  );

  return (
    <nav className="c-compound-menu row">
      {menuItems}
    </nav>
  );
};

CompoundMenu.propTypes = {
  /* Array of arrays */
  items: PropTypes.array
  // orientation: PropTypes.string,
  // align: PropTypes.string
};

CompoundMenu.defaultProps = {
  items: []
};

export default CompoundMenu;
