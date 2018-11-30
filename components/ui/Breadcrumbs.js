import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';
import Icon from 'components/ui/Icon';

function Breadcrumbs({ items = [] }) {
  return (
    <ul className="c-breadcrumbs">
      {items.map(item => (
        <li key={item.name} className="item">
          {item.route ? (
            <Link route={item.route} params={item.params}>
              <a>
                {items.length === 1 && (
                  <Icon className="c-icon -smaller" name="icon-arrow-left-2" />
                )}
                <span>{item.name}</span>
              </a>
            </Link>
          ) : (
            <a href={item.href}>
              {items.length === 1 && <Icon className="c-icon -smaller" name="icon-arrow-left-2" />}
              <span>{item.name}</span>
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

Breadcrumbs.propTypes = { items: PropTypes.array };

export default Breadcrumbs;
