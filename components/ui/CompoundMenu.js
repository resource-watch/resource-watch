import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

const CompoundMenu = ({ items }) => {
  const menuItems = items.map(submenu => (
    <ul key={submenu[0].name} className="submenu column small-12 medium-3 large-3">
      {submenu.map((item, j) => { // eslint-disable-line arrow-body-style
        const linkParams = {};
        if (item.route) linkParams.route = item.route;
        if (item.params) linkParams.params = item.params;

        return j === 0
          ? <li key={item.name} className="item title"><h3><Link {...linkParams}><a>{item.name}</a></Link></h3></li>
          : <li key={item.name} className="item"><Link {...linkParams}><a>{item.name}</a></Link></li>;
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
