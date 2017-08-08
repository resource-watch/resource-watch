import React from 'react';

// Layout
import Page from 'components/admin/layout/Page';
import Layout from 'components/admin/layout/Layout';
import Tabs from 'components/ui/Tabs';

// Tabs
import DashboardsTab from 'components/admin/dashboards/DashboardsTab';

// Components
import Title from 'components/ui/Title';

// Contants
const DATA_TABS = [{
  label: 'Dashboards',
  value: 'dashboards',
  route: 'admin_dashboards',
  params: { tab: 'dashboards' }
}];

class Dashboards extends Page {

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
    const { url, user } = this.props;
    const { tab, subtab, id } = this.state;

    return (
      <Layout
        title="Dashboards"
        description="Dashboards description..."
        user={user}
        url={url}
      >
        {/* PAGE HEADER */}
        <div className="c-page-header -admin">
          <div className="l-container">
            <div className="page-header-content -padding-b-0">
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
        <div className="c-page-section">
          <div className="l-container">
            {tab === 'dashboards' &&
              <DashboardsTab tab={tab} subtab={subtab} id={id} />
            }
          </div>
        </div>
      </Layout>
    );
  }
}

Dashboards.propTypes = {
  user: React.PropTypes.object,
  url: React.PropTypes.object
};


export default Dashboards;
