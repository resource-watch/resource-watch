import React, {
  useState,
} from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useDebouncedCallback } from 'use-debounce';
import Tether from 'react-tether';

// utils
import { logEvent } from 'utils/analytics';

const HeaderData = ({
  children,
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
        <Link href="/data/explore">
          <a
            ref={ref}
            onMouseEnter={() => toggleDropdown(true)}
            onMouseLeave={() => toggleDropdown(false)}
          >
            Data
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
            {children.map((c) => (
              <li
                key={c.label}
                className="header-dropdown-list-item"
                role="button"
                tabIndex={-1}
                onKeyPress={() => {
                  if (c.logEvent) logEvent(`${c.label} link clicked`, 'Header');
                }}
                onClick={() => {
                  if (c.logEvent) logEvent(`${c.label} link clicked`, 'Header');
                }}
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

HeaderData.propTypes = {
  children: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      logEvent: PropTypes.bool,
    }),
  ).isRequired,
};

export default HeaderData;
