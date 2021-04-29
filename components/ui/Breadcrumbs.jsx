import PropTypes from 'prop-types';
import Link from 'next/link';

// components
import Icon from 'components/ui/icon';

export default function Breadcrumbs({
  items,
}) {
  return (
    <ul className="c-breadcrumbs">
      {items.map((item) => (
        <li key={item.name} className="item">
          {item.route ? (
            <Link href={item.route}>
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

Breadcrumbs.defaultProps = {
  items: [],
};

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      route: PropTypes.string,
      href: PropTypes.string,
    }),
  ),
};
