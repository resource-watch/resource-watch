import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// Redux
import { getUserAreas } from 'redactions/user';

// components
import Layout from 'layout/layout/layout-app';
import Tabs from 'components/ui/Tabs';
import Title from 'components/ui/Title';

// MyRW sections
import Profile from 'components/app/myrw/profile';
import DatasetsTab from 'components/app/myrw/datasets/DatasetsTab';
import DashboardsTab from 'components/app/myrw/dashboards/DashboardsTab';
import WidgetsTab from 'components/app/myrw/widgets/WidgetsTab';
import AreasTab from 'components/app/myrw/areas/AreasTab';
import CollectionsTab from 'components/app/myrw/collections/CollectionsTab';

// Contants
const MYRW_TABS = [
  {
    label: 'Profile',
    value: 'profile',
    route: 'myrw',
    params: { tab: 'profile' }
  },
  {
    label: 'Datasets',
    value: 'datasets',
    desktopOnly: true,
    route: 'myrw',
    params: { tab: 'datasets', subtab: 'my_datasets' }
  },
  {
    label: 'Visualizations',
    value: 'widgets',
    route: 'myrw',
    params: { tab: 'widgets', subtab: 'my_widgets' }
  },
  {
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
  }
];

class MyRW extends Component {
  static defaultProps = {};

  static propTypes = {
    url: PropTypes.object,
    user: PropTypes.object,
    routes: PropTypes.object
  };

  static async getInitialProps({ store, query }) {
    const { tab, subtab } = query;

    if (tab === 'areas') {
      await store.dispatch(getUserAreas({ layerGroups: true }));
    }

    // If user is not logged redirect to login
    // if (!user.token && typeof window !== 'undefined') {
    //   window.location.pathname = '/sign-in';
    // }

    return { tab, subtab, query };
  }

  // constructor(props) {
  //   super(props);

  //   const { tab, subtab } = props;

  //   this.state = {
  //     tab: tab || 'widgets',
  //     subtab
  //   };
  // }

  // componentWillReceiveProps(nextProps) {
  //   const { url } = nextProps;

  //   this.setState({
  //     tab: url.query.tab || 'widgets',
  //     subtab: url.query.subtab
  //   });
  // }

  render() {
    const { tab, subtab, user, query } = this.props;

    if (!user || !(user.userToken || user.token)) return null;

    const userName = user && user.name ? ` ${user.name.split(' ')[0]}` : '';
    const title = userName ? `Hi${userName}!` : 'My Resource Watch';

    return (
      <Layout
        title="My Resource Watch Edit Profile"
        description="My Resource Watch Edit Profile description"
        // url={url}
        user={user}
        pageHeader
      >
        <div className="c-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content -with-tabs">
                  <Title className="-primary -huge page-header-title">{title}</Title>
                  <Tabs options={MYRW_TABS} defaultSelected={tab} selected={tab} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="c-page-section">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                {tab === 'profile' && <Profile />}
                {tab === 'datasets' && <DatasetsTab tab={tab} subtab={subtab} />}{' '}
                {tab === 'dashboards' && <DashboardsTab tab={tab} subtab={subtab} />}
                {tab === 'areas' && <AreasTab tag={tab} subtab={subtab} query={query} />}
                {tab === 'widgets' && <WidgetsTab tab={tab} subtab={subtab} />}
                {tab === 'collections' && <CollectionsTab tab={tab} subtab={subtab} />}
                {tab !== ('profile' && 'datasets') && (tab !== 'widgets') && (
                  <div className="c-button-container -j-center explore c-field-buttons">
                    <ul className="c-field-buttons">
                      <li />
                    </ul>
                    <Link route={tab !== 'dashboards' ? 'explore' : 'topics'}>
                      <a className="c-button -secondary">
                        {tab !== 'dashboards' ? 'Explore Datasets' : 'Discover Topics'}
                      </a>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default MyRW;
