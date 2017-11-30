import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function DashboardThumbnailList({
  dashboards,
  size,
  selected,
  expanded,
  onSelect,
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
      {size > 5 &&
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
  size: PropTypes.number,
  selected: PropTypes.string,
  expanded: PropTypes.bool,
  onSelect: PropTypes.func,
  onExpand: PropTypes.func
};

DashboardThumbnailList.defaultProps = {
  dashboards: [],
  selected: '',
  expanded: false
};
