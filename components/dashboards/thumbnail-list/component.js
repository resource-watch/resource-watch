import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// styles
import './styles.scss';

class DashboardThumbnailList extends PureComponent {
  static propTypes = { dashboards: PropTypes.array.isRequired }

  render() {
    const { dashboards } = this.props;

    return (
      <ul className="c-dashboard-thumbnail-list">
        {dashboards.map(_dashboard => (
          <li
            key={_dashboard.slug}
            style={{ backgroundImage: `url(${_dashboard.photo.original})` }}
          >
            <Link
              to="dashboards_detail"
              params={{ slug: _dashboard.slug }}
            >
              <a><span>{_dashboard.name}</span></a>
            </Link>
          </li>
        ))}
      </ul>
    );
  }
}

export default DashboardThumbnailList;
