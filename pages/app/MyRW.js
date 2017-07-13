import React from 'react';

// Services
import UserService from 'services/UserService';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Tabs from 'components/ui/Tabs';
import Title from 'components/ui/Title';

// My RW
import MyRWProfile from 'components/app/myrw/MyRWProfile';
import MyRWDashboards from 'components/app/myrw/MyRWDashboards';
import MyRWInsights from 'components/app/myrw/MyRWInsights';
import MyRWWidgets from 'components/app/myrw/MyRWWidgets';
import MyRWSubscriptions from 'components/app/myrw/MyRWSubscriptions';

// Contants
const MYRW_TABS = [{
  label: 'Profile',
  value: 'profile',
  route: 'myrw',
  params: { tab: 'profile' }
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
}, {
  label: 'Insights',
  value: 'insights',
  route: 'myrw',
  params: { tab: 'insights' }
}, {
  label: 'Subscriptions',
  value: 'subscriptions',
  route: 'myrw',
  params: { tab: 'subscriptions' }
}];

class MyRW extends Page {

  constructor(props) {
    super(props);

    const { url } = props;

    this.state = {
      tab: url.query.tab || 'profile',
      subtab: url.query.subtab,
      element: url.query.element
    };
  }

  componentWillReceiveProps(nextProps) {
    const { url } = nextProps;

    this.setState({
      tab: url.query.tab || 'profile',
      subtab: url.query.subtab,
      element: url.query.element
    });
  }

  render() {
    const { tab, subtab, element } = this.state;

    return (
      <Layout
        title="My Resource Watch Edit Profile"
        description="My Resource Watch Edit Profile description"
        url={this.props.url}
        user={this.props.user}
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

        {tab === 'profile' &&
          <MyRWProfile subtab={subtab} />
        }

        {tab === 'dashboards' &&
          <MyRWDashboards subtab={subtab} />
        }

        {tab === 'widgets' &&
          <MyRWWidgets subtab={subtab} element={element} />
        }

        {tab === 'insights' &&
          <MyRWInsights subtab={subtab} />
        }

        {tab === 'subscriptions' &&
          <MyRWSubscriptions subtab={subtab} />
        }
      </Layout>
    );
  }
}

MyRW.defaultProps = {
};

MyRW.propTypes = {
  url: React.PropTypes.object,
  user: React.PropTypes.object
};


export default MyRW;
