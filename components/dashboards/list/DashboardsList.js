import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { getDashboards, setFilters } from 'redactions/admin/dashboards';

// Selectors
import getFilteredDashboards from 'selectors/admin/dashboards';

// Components
import Spinner from 'components/ui/Spinner';
import SearchInput from 'components/ui/SearchInput';
import DashboardsListCard from 'components/dashboards/list/DashboardsListCard';

class DashboardsList extends React.Component {

  constructor(props) {
    super(props);

    this.onSearch = this.onSearch.bind(this);
  }

  componentDidMount() {
    const { getDashboardsFilters } = this.props;

    this.props.setFilters([]);
    this.props.getDashboards({
      // includes: 'widget,layer,metadata,vocabulary',
      // filters: getDashboardsFilters
    });
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

  render() {
    const { dashboards, routes } = this.props;

    return (
      <div className="c-dashboard-list">
        <Spinner className="-light" isLoading={this.props.loading} />

        <SearchInput
          input={{
            placeholder: 'Search dashboard'
          }}
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
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

DashboardsList.defaultProps = {
  routes: {
    index: '',
    detail: ''
  },
  getDashboardsFilters: {},
  // Store
  dashboards: []
};

DashboardsList.propTypes = {
  routes: PropTypes.object,
  getDashboardsFilters: PropTypes.object,

  // Store
  user: PropTypes.object,
  dashboards: PropTypes.array.isRequired,
  loading: PropTypes.bool,

  // Actions
  getDashboards: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  loading: state.dashboards.dashboards.loading,
  dashboards: getFilteredDashboards(state),
  error: state.dashboards.dashboards.error
});
const mapDispatchToProps = dispatch => ({
  getDashboards: options => dispatch(getDashboards(options)),
  setFilters: filters => dispatch(setFilters(filters))
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardsList);
