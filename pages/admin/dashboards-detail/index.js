import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { singular } from 'pluralize';
import { toastr } from 'react-redux-toastr';

// services
import { fetchDashboard } from 'services/dashboard';

// components
import Layout from 'layout/layout/layout-admin';
import DashboardsTab from 'components/admin/dashboards/DashboardsTab';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Title from 'components/ui/Title';

// Utils
import { capitalizeFirstLetter } from 'utils/utils';

class AdminDashboardsDetailPage extends PureComponent {
  static propTypes = {
    url: PropTypes.object.isRequired,
    hostname: PropTypes.string.isRequired
  };

  state = {
    ...this.props.url.query,
    data: {}
  }

  componentDidMount() {
    const { id } = this.state;

    if (id === 'new') return;

    fetchDashboard(id)
      .then((data) => { this.setState({ data }); })
      .catch((err) => { toastr.error('Error', err.message); });
  }

  componentWillReceiveProps(nextProps) {
    const { tab, id, subtab } = nextProps.url.query;

    this.setState({ tab, id, subtab });
  }

  /**
   * HELPERS
   * - getName
  */
  getName() {
    const { tab, id, data } = this.state;

    if (id === 'new') {
      return `New ${singular(tab)}`;
    }

    if (data.name) {
      return data.name;
    }

    return '-';
  }

  render() {
    const { tab, subtab, id } = this.state;
    const { hostname } = this.props;

    return (
      <Layout
        title={this.getName()}
        // TO-DO: fill description
        description="Dashboards detail..."
        hostname={hostname}
      >
        <div className="c-page-header -admin">
          <div className="l-container -admin">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <Breadcrumbs
                    items={[{ name: capitalizeFirstLetter(tab), route: 'admin_dashboards', params: { tab } }]}
                  />
                  <Title className="-primary -huge page-header-title" >
                    {this.getName()}
                  </Title>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="c-page-section">
          <div className="l-container -admin">
            <div className="row">
              <div className="column small-12">
                {tab === 'dashboards' && (<DashboardsTab tab={tab} subtab={subtab} id={id} />)}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default AdminDashboardsDetailPage;
