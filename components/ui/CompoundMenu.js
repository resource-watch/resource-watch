import React from 'react';
import { Link } from 'routes';

const CompoundMenu = ({ items }) => {
  const menuItems = items.map((submenu, i) => (
    <ul key={i} className="submenu column small-12 medium-3 large-3">
      {submenu.map((item, j) => {
        return j === 0 ?
          <li key={j} className="item title"><h3><Link to={item.path}>{item.name}</Link></h3></li> :
          <li key={j} className="item"><Link to={item.path}>{item.name}</Link></li>
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
  items: React.PropTypes.array,
  orientation: React.PropTypes.string,
  align: React.PropTypes.string
};

CompoundMenu.defaultProps = {
  items: []
};

export default CompoundMenu;
