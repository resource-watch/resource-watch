import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';
import { getDashboards, deleteDashboard, setFilters } from 'redactions/admin/dashboards';

// Selectors
import getFilteredDashboards from 'selectors/admin/dashboards';

// Components
import Spinner from 'components/ui/Spinner';
import SearchInput from 'components/ui/SearchInput';
import DashboardsListCard from 'components/dashboards/list/DashboardsListCard';

class DashboardsList extends React.Component {
  static defaultProps = {
    routes: {
      index: '',
      detail: ''
    },
    getDashboardsFilters: {},
    // Store
    loading: false,
    filters: []
  };

  static propTypes = {
    routes: PropTypes.object,
    getDashboardsFilters: PropTypes.object,

    // Store
    dashboards: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    filters: PropTypes.array,

    // Actions
    getDashboards: PropTypes.func.isRequired,
    deleteDashboard: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };

    this.onSearch = this.onSearch.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    const { getDashboardsFilters } = this.props;

    this.props.setFilters([]);
    this.props.getDashboards({ filters: getDashboardsFilters });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loading !== this.state.loading) {
      this.setState({ loading: nextProps.loading });
    }
  }

  /**
   * UI EVENTS
   * - onSearch
  */
  onSearch(value) {
    if (!value.length) {
      this.props.setFilters([]);
    } else {
      this.props.setFilters([{ key: 'name', value }]);
    }
  }

  onDelete(dashboard) {
    toastr.confirm(`Are you sure that you want to delete: "${dashboard.name}"`, {
      onOk: () => {
        this.props.deleteDashboard({
          id: dashboard.id
        })
          .then(() => {
            const { getDashboardsFilters } = this.props;

            this.props.setFilters([]);
            this.props.getDashboards({
              filters: getDashboardsFilters
            });
            toastr.success('Success', `The dashboard "${dashboard.id}" - "${dashboard.name}" has been removed correctly`);
          })
          .catch((err) => {
            toastr.error('Error', `The dashboard "${dashboard.id}" - "${dashboard.name}" was not deleted. Try again. ${err}`);
          });
      }
    });
  }

  render() {
    const { dashboards, routes, filters } = this.props;
    const { loading } = this.state;

    return (
      <div className="c-dashboards-list">
        <Spinner
          className="-light"
          isLoading={loading}
        />

        <SearchInput
          input={{ placeholder: 'Search dashboard' }}
          link={{
            label: 'New dashboard',
            route: routes.detail,
            params: { tab: 'dashboards', id: 'new' }
          }}
          onSearch={this.onSearch}
        />

        <div className="l-row row list">
          {dashboards.map(dashboard => (
            <div
              className="column list-item small-12 medium-4"
              key={dashboard.id}
            >
              <DashboardsListCard
                dashboard={dashboard}
                routes={routes}
                onDelete={this.onDelete}
              />
            </div>
          ))}
          {!loading && dashboards.length === 0 && filters.length === 0 &&
            <div className="text-container">
              You currently have no dashboards
            </div>
          }
          {!loading && dashboards.length === 0 && filters.length > 0 &&
            <div className="text-container">
              There were no dashboards found with the text provided
            </div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  loading: state.dashboards.dashboards.loading,
  dashboards: getFilteredDashboards(state),
  error: state.dashboards.dashboards.error,
  filters: state.clientDashboards.filters
});

const mapDispatchToProps = {
  getDashboards,
  deleteDashboard,
  setFilters
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardsList);
