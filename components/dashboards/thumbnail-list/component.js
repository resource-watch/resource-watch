import React, { PureComponent } from 'react';
import classnames from 'classnames';

import PropTypes from 'prop-types';

// styles
import './styles.scss';

class DashboardThumbnailList extends PureComponent {
  static propTypes = {
    dashboards: PropTypes.array,
    onSelect: PropTypes.func
  }

  static defaultProps = {
    onSelect: () => {},
    dashboards: []
  }

  render() {
    const { dashboards, onSelect } = this.props;

    return (
      <div className="c-dashboards-gallery-list">
        <div className="row l-row -equal-height">
          {
            dashboards.map(dashboard => (
              <div
                key={dashboard.slug}
                className={classnames({
                  column: true,
                  'small-12': true,
                  'medium-6': true,
                  'large-3': true
                })}
              >
                <button
                  key={dashboard.slug}
                  tabIndex="0"
                  className="thumbnail-list-item"
                  style={{ backgroundImage: `url(${dashboard.photo && dashboard.photo.original})` }}
                  onClick={() => onSelect(dashboard)}
                >
                  <div className="content" htmlFor={`topic-${dashboard.slug}`}>
                    <div className="text">
                      <h4 className="dashboard-title">{dashboard.name}</h4>
                      <div className="dashboard-author">
                        <div
                          className="image"
                          style={{ backgroundImage: `url(${dashboard.photo && dashboard.photo.thumb})` }}
                        />
                        <div className="name">
                          name
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

export default DashboardThumbnailList;
