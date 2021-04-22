import {
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import Tether from 'react-tether';
import { toastr } from 'react-redux-toastr';

// services
import { cloneDashboard } from 'services/dashboard';

// hooks
import {
  useFeaturedDashboards,
} from 'hooks/dashboard';

export default function ImportDashboardSelector({
  user,
}) {
  const [isOpen, setOpen] = useState(false);

  const onCloneDashboard = useCallback((dashboardValue) => {
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
  }, [user]);

  const {
    data: featuredDashboards,
  } = useFeaturedDashboards({}, {
    placeholderData: [],
    refetchOnWindowFocus: false,
  });

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
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <h4 className="template-name">Clone a dashboard page</h4>
          <span className="template-description">Clone a dashboard page into a new dashboard</span>
        </li>
      )}
      renderElement={(ref) => {
        if (!isOpen || !featuredDashboards.length) return null;

        return (
          <ul
            ref={ref}
            className="header-dropdown-list"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            {featuredDashboards.map((_dashboard) => (
              <li
                className="header-dropdown-list-item"
                key={_dashboard.id}
              >
                <button
                  type="button"
                  className="c-button -clean -fs-medium"
                  onClick={() => onCloneDashboard(_dashboard)}
                >
                  {_dashboard.name}
                </button>
              </li>
            ))}
          </ul>
        );
      }}
    />
  );
}

ImportDashboardSelector.propTypes = {
  user: PropTypes.shape({}).isRequired,
};
