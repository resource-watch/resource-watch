import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// Components
import Title from 'components/ui/Title';

function DashboardsListCard({ dashboard, routes, onDelete }) {
  return (
    <div className="c-card">
      <div className="card-container">
        <header className="card-header">
          <Link
            route={routes.detail}
            params={{ tab: 'dashboards', id: dashboard.id }}
          >
            <a>
              <Title className="-default">
                {dashboard.name}
              </Title>
            </a>
          </Link>
        </header>

        <div className="card-content">
          <div className="card-actions">
            <a
              className="c-button -tertiary -compressed"
              target="_blank"
              href={`/data/dashboards/${dashboard.slug}`}
            >
              Preview
            </a>

            <button
              className="c-button -tertiary -compressed"
              onClick={() => onDelete(dashboard)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

DashboardsListCard.defaultProps = {
  routes: {
    index: '',
    detail: ''
  },
  dashboard: {},
  onDelete: null
};

DashboardsListCard.propTypes = {
  dashboard: PropTypes.object,
  routes: PropTypes.object,
  onDelete: PropTypes.func
};

export default DashboardsListCard;
