import React from 'react';
import PropTypes from 'prop-types';
import { singular } from 'pluralize';
import { toastr } from 'react-redux-toastr';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Services
import DashboardsService from 'services/DashboardsService';

// Utils
import { capitalizeFirstLetter } from 'utils/utils';

// Layout
import Page from 'components/admin/layout/Page';
import Layout from 'components/admin/layout/Layout';

// Tabs
import DashboardsTab from 'components/admin/dashboards/DashboardsTab';
import Breadcrumbs from 'components/ui/Breadcrumbs';

// Components
import Title from 'components/ui/Title';

class DashboardsDetail extends Page {
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
      case 'dashboards':
        if (id !== 'new') {
          this.service = new DashboardsService({
            authorization: props.user.token
          });
        }
        break;
      // TODO: do the same service for widgets and layers
      default:
    }
  }

  componentDidMount() {
    const { id } = this.state;

    if (this.service) {
      this.service.fetchData({ id })
        .then((data) => {
          this.setState({
            data: data || {}
          });
        })
        .catch((err) => {
          toastr.error('Error', err);
        });
    }
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
    const { url, user } = this.props;
    const { tab, subtab, id } = this.state;

    return (
      <Layout
        title={this.getName()}
        description="Dashboards detail..."
        user={user}
        url={url}
      >
        {/* PAGE HEADER */}
        <div className="c-page-header -admin">
          <div className="l-container">
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
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                {tab === 'dashboards' &&
                  <DashboardsTab tab={tab} subtab={subtab} id={id} />
                }
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

DashboardsDetail.propTypes = {
  user: PropTypes.object,
  url: PropTypes.object
};

export default withRedux(initStore, null, null)(DashboardsDetail);
