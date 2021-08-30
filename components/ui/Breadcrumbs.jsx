import PropTypes from 'prop-types';
import Link from 'next/link';
import classnames from 'classnames';

// components
import Icon from 'components/ui/icon';

export default function Breadcrumbs({
  items,
  className,
}) {
  return (
    <ul className={classnames('c-breadcrumbs', { [className]: !!className })}>
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
  className: null,
};

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      route: PropTypes.string,
      href: PropTypes.string,
    }),
  ),
  className: PropTypes.string,
};
