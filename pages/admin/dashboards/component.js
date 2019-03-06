import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import Layout from 'layout/layout/layout-admin';
import Tabs from 'components/ui/Tabs';
import Title from 'components/ui/Title';
import DashboardsTab from 'components/admin/dashboards/DashboardsTab';

// constants
const DATA_TABS = [{
  label: 'Dashboards',
  value: 'dashboards',
  route: 'admin_dashboards',
  params: { tab: 'dashboards' }
}];

class AdminDashboardsPage extends PureComponent {
  static propTypes = { url: PropTypes.object.isRequired };

  constructor(props) {
    super(props);

    const { url } = props;

    this.state = {
      tab: url.query.tab || 'dashboards',
      id: url.query.id,
      subtab: url.query.subtab
    };
  }

  componentWillReceiveProps(nextProps) {
    const { url } = nextProps;

    this.setState({
      tab: url.query.tab || 'dashboards',
      id: url.query.id,
      subtab: url.query.subtab
    });
  }

  render() {
    const {
      tab,
      subtab,
      id
    } = this.state;

    return (
      <Layout
        title="Dashboards"
        // TO-DO: fill description
        description="Dashboards description..."
      >
        {/* PAGE HEADER */}
        <div className="c-page-header -admin">
          <div className="l-container -admin">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content -with-tabs">
                  <Title className="-primary -huge page-header-title" >
                    Dashboards
                  </Title>
                  <Tabs
                    options={DATA_TABS}
                    defaultSelected={tab}
                    selected={tab}
                  />
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

export default AdminDashboardsPage;
