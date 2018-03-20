import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import Page from 'layout/page';
import Layout from 'layout/layout/layout-app';
import Tabs from 'components/ui/Tabs';
import Title from 'components/ui/Title';

// My RW
import ProfilesTab from 'components/app/myrw/profiles/ProfilesTab';
import DatasetsTab from 'components/app/myrw/datasets/DatasetsTab';
import DashboardsTab from 'components/app/myrw/dashboards/DashboardsTab';
import WidgetsTab from 'components/app/myrw/widgets/WidgetsTab';
import AreasTab from 'components/app/myrw/areas/AreasTab';
import CollectionsTab from 'components/app/myrw/collections/CollectionsTab';

// Contants
const MYRW_TABS = [{
  label: 'Profile',
  value: 'profile',
  route: 'myrw',
  params: { tab: 'profile' }
}, {
  label: 'Datasets',
  value: 'datasets',
  route: 'myrw',
  params: { tab: 'datasets', subtab: 'my_datasets' }
}, {
  label: 'Widgets',
  value: 'widgets',
  route: 'myrw',
  params: { tab: 'widgets', subtab: 'my_widgets' }
}, {
  label: 'Dashboards',
  value: 'dashboards',
  route: 'myrw',
  params: { tab: 'dashboards' }
},
{
  label: 'Areas of interest',
  value: 'areas',
  route: 'myrw',
  params: { tab: 'areas' }
},
{
  label: 'Collections',
  value: 'collections',
  route: 'myrw',
  params: { tab: 'collections' }
}];

class MyRW extends Page {
  constructor(props) {
    super(props);

    const { url, tab } = props;

    this.state = {
      tab: url.query.tab || 'profile',
      subtab: url.query.subtab
    };
  }

  componentWillReceiveProps(nextProps) {
    const { url } = nextProps;

    this.setState({
      tab: url.query.tab || 'profile',
      subtab: url.query.subtab
    });
  }

  render() {
    const { url, user } = this.props;
    const { tab, subtab } = this.state;
    const userName = user && user.name ? ` ${user.name.split(' ')[0]}` : '';
    const title = `Hi${userName}!`;
    return (
      <Layout
        title="My Resource Watch Edit Profile"
        description="My Resource Watch Edit Profile description"
        url={url}
        user={user}
        pageHeader
      >
        <div className="c-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content -with-tabs">
                  <Title className="-primary -huge page-header-title" >
                    {title}
                  </Title>
                  <Tabs
                    options={MYRW_TABS}
                    defaultSelected={tab}
                    selected={tab}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className="c-page-section">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">

                {tab === 'profile' &&
                  <ProfilesTab tab={tab} subtab={subtab} />
                }

                {tab === 'datasets' &&
                  <DatasetsTab tab={tab} subtab={subtab} />
                }

                {tab === 'dashboards' &&
                  <DashboardsTab tab={tab} subtab={subtab} />
                }

                {tab === 'areas' &&
                  <AreasTab tag={tab} subtab={subtab} query={url.query} />
                }

                {tab === 'widgets' &&
                  <WidgetsTab tab={tab} subtab={subtab} />
                }

                {tab === 'collections' &&
                  <CollectionsTab tab={tab} subtab={subtab} />
                }

              </div>
            </div>
          </div>
        </div>

      </Layout>
    );
  }
}

MyRW.defaultProps = {
};

MyRW.propTypes = {
  url: PropTypes.object,
  user: PropTypes.object
};

export default withRedux(initStore, null, null)(MyRW);
