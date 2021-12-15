import { useState } from 'react';
import Link from 'next/link';
import { useDebouncedCallback } from 'use-debounce';
import Tether from 'react-tether';

// hooks
import { useFeaturedDashboards } from 'hooks/dashboard';

export default function HeaderDashboards() {
  const [isVisible, setVisibility] = useState(false);
  const toggleDropdown = useDebouncedCallback((_isVisible) => {
    setVisibility(_isVisible);
  }, 50);

  const { data: featuredDashboards } = useFeaturedDashboards(
    { env: process.env.NEXT_PUBLIC_ENVS_SHOW },
    {
      select: (_dashboards) =>
        _dashboards.map(({ id, name, slug }) => ({
          id: slug === 'ocean' ? 'ocean-watch' : id,
          label: slug === 'ocean' ? 'Ocean Watch' : name,
          href: slug === 'ocean' ? '/dashboards/ocean-watch' : `/dashboards/${slug}`,
        })),
      placeholderData: [],
      refetchOnWindowFocus: false,
    },
  );

  return (
    <Tether
      attachment="top center"
      constraints={[
        {
          to: 'window',
        },
      ]}
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
        if (!isVisible || !featuredDashboards.length) return null;

        return (
          <ul
            ref={ref}
            className="header-dropdown-list"
            onMouseEnter={() => toggleDropdown(true)}
            onMouseLeave={() => toggleDropdown(false)}
          >
            {featuredDashboards.map(({ id, label, href }) => (
              <li className="header-dropdown-list-item" key={id}>
                <Link href={href}>
                  <a>{label}</a>
                </Link>
              </li>
            ))}
          </ul>
        );
      }}
    />
  );
}
