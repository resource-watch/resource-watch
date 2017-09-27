import React from 'react';
import PropTypes from 'prop-types';
import { singular } from 'pluralize';
import { toastr } from 'react-redux-toastr';

// Next components
import { Link } from 'routes';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Utils
import { capitalizeFirstLetter } from 'utils/utils';

// Services
import DatasetsService from 'services/DatasetsService';
import WidgetsService from 'services/WidgetsService';
import DashboardsService from 'services/DashboardsService';
import UserService from 'services/UserService';

// Layout
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Breadcrumbs from 'components/ui/Breadcrumbs';

// Tabs
import AreasTab from 'components/app/myrw/areas/AreasTab';
import DatasetsTab from 'components/app/myrw/datasets/DatasetsTab';
import WidgetsTab from 'components/app/myrw/widgets/WidgetsTab';
import DashboardsTab from 'components/app/myrw/dashboards/DashboardsTab';
// import LayersTab from 'components/app/myrw/layers/LayersTab';

// Components
import Title from 'components/ui/Title';

class MyRWDetail extends Page {
  constructor(props) {
    super(props);

    const { tab, id, subtab } = props.url.query;

    this.state = {
      tab,
      id,
      subtab,
      data: {}
    };

    this.service = null;

    switch (tab) {
      case 'datasets':
        if (id !== 'new') {
          this.service = new DatasetsService();
        }
        break;

      case 'widgets':
        if (id !== 'new') {
          this.service = new WidgetsService();
        }
        break;

      case 'dashboards':
        if (id !== 'new') {
          this.service = new DashboardsService();
        }
        break;

      case 'areas':
        if (id !== 'new') {
          this.service = new UserService({ apiURL: process.env.WRI_API_URL });
        }
        break;

      default:
    }
  }

  componentDidMount() {
    const { id, tab } = this.state;
    const { user } = this.props;

    if (this.service) {
      // Fetch the dataset / layer / widget depending on the tab
      if (tab !== 'areas') {
        this.service.fetchData({ id })
          .then((data) => {
            this.setState({ data });
          })
          .catch((err) => {
            toastr.error('Error', err);
          });
      } else {
        this.service.getArea(id, `Bearer ${user.token}`).then((data) => {
          this.setState({ data: data.data });
        })
          .catch((err) => {
            toastr.error('Error', err);
          });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { tab, id, subtab } = nextProps.url.query;

    this.setState({ tab, id, subtab });
  }


  /**
   * HELPERS
   * - getName
   * - getDatasetName
  */
  getName() {
    const { tab, id, data } = this.state;

    if (id === 'new') {
      return `New ${singular(tab)}`;
    }

    if (data.name) {
      return data.name;
    }

    if (data.attributes && data.attributes.name) {
      return data.attributes.name;
    }

    return '-';
  }

  render() {
    const { url, user, myrwdetail } = this.props;
    const { tab, subtab, id } = this.state;

    return (
      <Layout
        title={this.getName()}
        description="Data detail..."
        user={user}
        url={url}
      >
        {/* PAGE HEADER */}
        <div className="c-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <Breadcrumbs
                    items={[{ name: capitalizeFirstLetter(tab), route: 'myrw', params: { tab } }]}
                  />
                  <Title className="-primary -huge page-header-title" >
                    {this.getName()}
                  </Title>
                  <div className="page-header-info">
                    <ul>
                      <li>Dataset: <Link route="explore_detail" params={{ id: myrwdetail.dataset.id }}><a>{myrwdetail.dataset.name}</a></Link></li>
                    </ul>
                  </div>
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
                  {tab === 'datasets' &&
                    <DatasetsTab tab={tab} subtab={subtab} id={id} />
                  }
                  {tab === 'areas' &&
                    <AreasTab tab={tab} subtab={subtab} id={id} />
                  }
                  {tab === 'widgets' &&
                    <WidgetsTab tab={tab} subtab={subtab} id={id} dataset={url.query.datasetId} />
                  }
                  {tab === 'dashboards' &&
                    <DashboardsTab tab={tab} subtab={subtab} id={id} />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

MyRWDetail.propTypes = {
  user: PropTypes.object,
  url: PropTypes.object
};

const mapStateToProps = state => ({
  // Store
  myrwdetail: state.myrwdetail
});

export default withRedux(initStore, mapStateToProps, null)(MyRWDetail);
