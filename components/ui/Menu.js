import React from 'react';
import { Link } from 'routes';

const Menu = ({ items, orientation, align }) => {
  const listItems = items.map((item, i) => {
    return (
      <li key={`menu-item-${i}`}>
        { item.path ?
          <Link to={item.path}>{item.name}</Link> :
          item.name }
      </li>
    );
  });

  return (
    <nav className={`c-menu -${orientation} -align-${align}`}>
      <ul>
        {listItems}
      </ul>
    </nav>
  );
};

Menu.propTypes = {
  items: React.PropTypes.array,
  align: React.PropTypes.string,
  orientation: React.PropTypes.string
};

Menu.defaultProps = {
  items: [],
  align: 'right',
  orientation: 'horizontal'
};

export default Menu;
