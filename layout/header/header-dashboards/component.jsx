import React, {
  useState,
} from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useDebouncedCallback } from 'use-debounce';
import Tether from 'react-tether';

const HeaderDashboards = ({
  dashboards,
}) => {
  const [isVisible, setVisibility] = useState(false);
  const [toggleDropdown] = useDebouncedCallback((_isVisible) => {
    setVisibility(_isVisible);
  }, 50);

  return (
    <Tether
      attachment="top center"
      constraints={[{
        to: 'window',
      }]}
      classes={{ element: 'c-header-dropdown' }}
      renderTarget={(ref) => (
        <Link href="/dashboards">
          <a
            ref={ref}
            onMouseEnter={() => toggleDropdown(true)}
            onMouseLeave={() => toggleDropdown(false)}
          >
            Dashboards
          </a>
        </Link>
      )}
      renderElement={(ref) => {
        if (!isVisible) return null;

        return (
          <ul
            ref={ref}
            className="header-dropdown-list"
            onMouseEnter={() => toggleDropdown(true)}
            onMouseLeave={() => toggleDropdown(false)}
          >
            {dashboards.map((c) => (
              <li
                className="header-dropdown-list-item"
                key={c.label}
              >
                <Link href={c.href}>
                  <a>{c.label}</a>
                </Link>
              </li>
            ))}
          </ul>
        );
      }}
    />
  );
};

HeaderDashboards.propTypes = {
  dashboards: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default HeaderDashboards;
