import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';
import { toastr } from 'react-redux-toastr';
import { singular } from 'pluralize';

// components
import Layout from 'layout/layout/layout-app';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import AreasTab from 'components/app/myrw/areas/AreasTab';
import DatasetsTab from 'components/app/myrw/datasets/DatasetsTab';
import WidgetsTab from 'components/app/myrw/widgets/WidgetsTab';
import DashboardsTab from 'components/app/myrw/dashboards/DashboardsTab';
import CollectionsTab from 'components/app/myrw/collections/CollectionsTab';
import Title from 'components/ui/Title';

// services
import DatasetsService from 'services/DatasetsService';
import WidgetsService from 'services/WidgetsService';
import UserService from 'services/UserService';
import { fetchDashboard } from 'services/dashboard';

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
    myrwdetail: PropTypes.object.isRequired,
    alerts: PropTypes.object.isRequired
  }

  state = { data: null }

  componentWillMount() {
    const {
      user,
      query: { id, tab },
      locale
    } = this.props;

    this.service = null;

    if (id === 'new') return;

    switch (tab) {
      case 'datasets':
        this.service = new DatasetsService({ language: locale });
        break;
      case 'widgets':
        this.service = new WidgetsService();
        break;
      case 'areas':
        this.service = new UserService({ apiURL: process.env.WRI_API_URL });
        break;
      default:
        this.service = new DatasetsService({ language: locale });
    }

    if (tab === 'dashboards' && (id && id !== 'new')) {
      fetchDashboard(id)
        .then((data) => { this.setState({ data }); })
        .catch((err) => { toastr.error('Error', err.message); });
    }

    if (this.service) {
      // Fetch the dataset / layer / widget depending on the tab
      if (tab !== 'areas' && tab !== 'dashboards' && tab !== 'collections') {
        this.service.fetchData({ id })
          .then((data) => { this.setState({ data }); })
          .catch((err) => { toastr.error('Error', err); });
      } else {
        if (tab === 'dashboards' || tab === 'collections') return;
        this.service.getArea(id, user.token)
          .then((data) => { this.setState({ data: data.data }); })
          .catch((err) => { toastr.error('Error', err); });
      }
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
            route="explore_detail"
            params={{ id: a.id }}
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
      myrwdetail,
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
                    (<div className="page-header-info">Alerts for {this.getAlerts()}</div>)}
                  {myrwdetail.dataset &&
                    (
                      <div className="page-header-info">
                        <ul>
                          <li>Dataset: <Link route="explore_detail" params={{ id: myrwdetail.dataset.id }}><a>{myrwdetail.dataset.name}</a></Link></li>
                        </ul>
                      </div>
                    )}
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
                  {(tab === 'areas') && (<AreasTab tab={tab} subtab={subtab} id={id} />)}
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
