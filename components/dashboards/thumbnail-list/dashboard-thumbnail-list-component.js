import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function DashboardThumbnailList({
  dashboards = [],
  total,
  selected = '',
  pagination,
  expanded = false,
  add = false,
  onSelect,
  onAdd,
  onExpand
}) {
  return (
    <ul className="c-dashboard-thumbnail-list">
      {
        dashboards.map(dashboard => (
          <li
            key={dashboard.slug}
            role="button"
            tabIndex="0"
            className={classnames({
              '-active': dashboard.slug === selected
            })}
            style={{
              backgroundImage: `url(${dashboard.photo.original})`
            }}
            onClick={() => onSelect(dashboard)}
          >
            <div className="content" htmlFor={`dashboard-${dashboard.slug}`}>
              {dashboard.name}
            </div>
          </li>
        ))
      }

      {!pagination && add &&
        <li
          className="-toggle"
          role="button"
          tabIndex="0"
          onClick={() => onAdd()}
        >
          <div className="content">
            New
          </div>
        </li>
      }

      {pagination && total > 5 &&
        <li
          className="-toggle"
          role="button"
          tabIndex="0"
          onClick={() => onExpand(!expanded)}
        >
          <div className="content">
            {expanded ? 'Close' : 'More'}
          </div>
        </li>
      }
    </ul>
  );
}

DashboardThumbnailList.propTypes = {
  dashboards: PropTypes.array,
  total: PropTypes.number,
  pagination: PropTypes.bool,
  add: PropTypes.bool,
  selected: PropTypes.string,
  expanded: PropTypes.bool,
  onSelect: PropTypes.func,
  onExpand: PropTypes.func,
  onAdd: PropTypes.func
};
