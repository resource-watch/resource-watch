import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Tabs from 'components/ui/Tabs';
import Title from 'components/ui/Title';

// My RW
import ProfilesTab from 'components/app/myrw/profiles/ProfilesTab';
import DatasetsTab from 'components/app/myrw/datasets/DatasetsTab';
import MyRWDashboards from 'components/app/myrw/MyRWDashboards';
import MyRWWidgets from 'components/app/myrw/MyRWWidgets';
import SubscriptionsTab from 'components/app/myrw/subscriptions/SubscriptionsTab';

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
  params: { tab: 'datasets' }
}, {
  label: 'Dashboards',
  value: 'dashboards',
  route: 'myrw',
  params: { tab: 'dashboards' }
}, {
  label: 'Widgets',
  value: 'widgets',
  route: 'myrw',
  params: { tab: 'widgets' }
},
{
  label: 'Areas of interest',
  value: 'areas',
  route: 'myrw',
  params: { tab: 'areas' }
}];

class MyRW extends Page {

  constructor(props) {
    super(props);

    const { url } = props;

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
            <div className="page-header-content -padding-b-0">
              <Title className="-primary -huge page-header-title" >
                My RW
              </Title>
              <Tabs
                options={MYRW_TABS}
                defaultSelected={tab}
                selected={tab}
              />
            </div>
          </div>
        </div>
        <div className="c-page-section">
          <div className="l-container">
            {tab === 'profile' &&
              <ProfilesTab tab={tab} subtab={subtab} />
            }

            {tab === 'datasets' &&
              <DatasetsTab tab={tab} subtab={subtab} />
            }

            {tab === 'dashboards' &&
              <MyRWDashboards subtab={subtab} />
            }

            {tab === 'areas' &&
              <SubscriptionsTab subtab={subtab} />
            }
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
