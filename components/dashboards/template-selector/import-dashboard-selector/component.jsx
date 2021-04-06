import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Tether from 'react-tether';
import { toastr } from 'react-redux-toastr';

// services
import { cloneDashboard } from 'services/dashboard';

class ImportSelector extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    dashboards: PropTypes.array.isRequired,
    getFeaturedDashboards: PropTypes.func.isRequired,
  };

  state = { isOpen: false }

  componentDidMount() {
    const { dashboards } = this.props;
    if (!dashboards.length) {
      this.props.getFeaturedDashboards();
    }
  }

  onCloneDashboard = (dashboardValue) => {
    const { user } = this.props;

    toastr.confirm('Are you sure you want to clone this dashboard?', {
      onOk: () => {
        cloneDashboard(dashboardValue, user, 'dashboards')
          .then((dashboard) => {
            const { id: dashboardId } = dashboard;
            window.open(`/myrw-detail/dashboards/${dashboardId}`, '_blank');
          })
          .catch((error) => {
            const { message } = error;
            toastr.error(message);
          });
      },
    });
  }

  render() {
    const { dashboards } = this.props;
    const { isOpen } = this.state;

    return (
      <Tether
        attachment="top center"
        constraints={[{
          to: 'window',
        }]}
        classes={{
          element: 'c-header-dropdown',
        }}
        renderTarget={(ref) => (
          <li
            ref={ref}
            className="template-list-item"
            onMouseEnter={() => this.setState({ isOpen: true })}
            onMouseLeave={() => this.setState({ isOpen: false })}
          >
            <h4 className="template-name">Clone a dashboard page</h4>
            <span className="template-description">Clone a dashboard page into a new dashboard</span>
          </li>
        )}
        renderElement={(ref) => {
          if (!isOpen) return null;

          return (
            <ul
              ref={ref}
              className="header-dropdown-list"
              onMouseEnter={() => this.setState({ isOpen: true })}
              onMouseLeave={() => this.setState({ isOpen: false })}
            >
              {dashboards.map((_dashboard) => (
                <li
                  className="header-dropdown-list-item"
                  key={_dashboard.id}
                >
                  <span onClick={() => this.onCloneDashboard(_dashboard)}>{_dashboard.name}</span>
                </li>
              ))}
            </ul>
          );
        }}
      />
    );
  }
}

export default ImportSelector;
