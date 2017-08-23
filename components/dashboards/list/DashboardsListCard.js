import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'routes';

// Components
import Title from 'components/ui/Title';

class DashboardsListCard extends React.Component {
  render() {
    const { dashboard, routes } = this.props;

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
            <Title className="-small">
              {dashboard.provider}
            </Title>
          </header>

          <div className="card-content">
            {dashboard.published && 'published' }
            {!dashboard.published && 'not published' }
          </div>
        </div>
      </div>
    );
  }
}

DashboardsListCard.defaultProps = {
  routes: {
    index: '',
    detail: ''
  },
  dashboard: {}
};

DashboardsListCard.propTypes = {
  dashboard: PropTypes.object,
  routes: PropTypes.object
};

export default DashboardsListCard;
