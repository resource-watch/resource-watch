import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';
import { toastr } from 'react-redux-toastr';
import { singular } from 'pluralize';

// components
import Layout from 'layout/layout/layout-app';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import AreasTabs from 'components/app/myrw/areas';
import DatasetsTab from 'components/app/myrw/datasets/DatasetsTab';
import WidgetsTab from 'components/app/myrw/widgets/WidgetsTab';
import DashboardsTab from 'components/app/myrw/dashboards/DashboardsTab';
import CollectionsTab from 'components/app/myrw/collections/CollectionsTab';
import Title from 'components/ui/Title';

// services
import { fetchDashboard } from 'services/dashboard';
import { fetchDataset } from 'services/dataset';
import { fetchWidget } from 'services/widget';
import { fetchArea } from 'services/areas';

// utils
import { capitalizeFirstLetter, listSeperator } from 'utils/utils';
import { getLabel } from 'utils/datasets/dataset-helpers';

// constants
import { MYRW_DETAIL_SUB_TABS } from './constants';

class LayoutMyRWDetail extends PureComponent {
  static propTypes = {
    query: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    alerts: PropTypes.object.isRequired
  }

  state = { data: null }

  UNSAFE_componentWillMount() {
    const {
      user,
      query: { id, tab },
      locale
    } = this.props;

    if (id === 'new') return;

    if (tab === 'dashboards') {
      fetchDashboard(id)
        .then((data) => { this.setState({ data }); })
        .catch((err) => { toastr.error('Error', err.message); });
    }

    // Fetch the dataset / layer / widget depending on the tab
    if (tab !== 'areas' && tab !== 'dashboards' && tab !== 'collections') {
      let service = fetchDataset;
      if (tab === 'widgets') {
        service = fetchWidget;
      }
      service(id, { language: locale })
        .then((data) => { this.setState({ data }); })
        .catch((err) => { toastr.error('Error', err); });
    } else {
      if (tab === 'dashboards' || tab === 'collections') return;

      fetchArea(id,
        {
          application: process.env.APPLICATIONS,
          env: process.env.API_ENV
        },
        { Authorization: user.token })
        .then((data) => { this.setState({ data }); })
        .catch((err) => { toastr.error('Error', err); });
    }
  }

  getName() {
    const { query: { tab, id, subtab } } = this.props;
    const { data } = this.state;

    if (id && subtab !== 'alerts') return id === 'new' ? `New ${singular(tab)}` : 'Edit';
    if (data && data.name) return data.name;
    if (data && data.attributes && data.attributes.name) return data.attributes.name;

    return '-';
  }

  getAlerts() {
    const { id } = this.state;
    const { alerts } = this.props;

    if (id in alerts) {
      const alert = alerts[id];
      return alert.map((a, k) => (
        <span>
          <Link
            route="explore"
            params={{ dataset: a.dataset }}
          >
            <a>
              {getLabel(a.dataset)}
            </a>
          </Link>{listSeperator(alert, k)}
        </span>));
    }
    return '';
  }

  render() {
    const {
      query: { tab, subtab, id }
    } = this.props;

    return (
      <Layout
        title={this.getName()}
        // TO-DO: fill description
        description="Data detail..."
      >
        <div className="c-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <Breadcrumbs
                    items={[{ name: capitalizeFirstLetter(tab), route: 'myrw', params: { tab, subtab: MYRW_DETAIL_SUB_TABS[tab] } }]}
                  />
                  <Title className="-primary -huge page-header-title" >
                    {this.getName()}
                  </Title>
                  {(subtab === 'alerts') &&
                    (<div className="page-header-info">Alerts for {this.getAlerts()}</div>)
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="c-page-section">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  {(tab === 'datasets') && (<DatasetsTab tab={tab} subtab={subtab} id={id} />)}
                  {(tab === 'areas') && (<AreasTabs tab={tab} subtab={subtab} id={id} />)}
                  {(tab === 'widgets') && (<WidgetsTab tab={tab} subtab={subtab} id={id} dataset={id} />)}
                  {(tab === 'dashboards') && (<DashboardsTab tab={tab} subtab={subtab} id={id} />)}
                  {(tab === 'collections') && (<CollectionsTab tab={tab} subtab={subtab} id={id} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default LayoutMyRWDetail;
