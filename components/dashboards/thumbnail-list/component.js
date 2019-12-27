import React, { PureComponent } from 'react';
import classnames from 'classnames';

import PropTypes from 'prop-types';

// styles
import './styles.scss';

class DashboardThumbnailList extends PureComponent {
  static propTypes = {
    dashboards: PropTypes.array,
    onSelect: PropTypes.func,
    user: PropTypes.bool
  }

  static defaultProps = {
    onSelect: () => {},
    dashboards: [],
    user: false
  }

  render() {
    const { dashboards, onSelect, user } = this.props;
    const buttonDefaultClass = 'thumbnail-list-item';
    const buttonClass = user ? buttonDefaultClass : `${buttonDefaultClass} no-user`;
    return (
      <div className="c-dashboards-thumbnail-list">
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
                  className={buttonClass}
                  style={{ backgroundImage: `url(${dashboard.photo && dashboard.photo.cover})` }}
                  onClick={() => onSelect(dashboard)}
                >
                  <div className="content" htmlFor={`dashboards-${dashboard.slug}`}>
                    <div className="text">
                      <h4 className="dashboard-title">{dashboard.name}</h4>
                      <div className="dashboard-author">
                        <div
                          className="image"
                          style={{ backgroundImage: `url(${dashboard.user && dashboard.user.photo ? dashboard.user.photo : '/static/images/logo-no-text.svg'})` }}
                        />
                        <div className="name">
                          {dashboard.user ? dashboard.user.name : 'Resource Watch staff'}
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
