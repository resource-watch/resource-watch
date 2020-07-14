import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// components
import Layout from 'layout/layout/layout-app';
import Tabs from 'components/ui/Tabs';
import Title from 'components/ui/Title';
import Profile from 'components/app/myrw/profile';
import DatasetsTab from 'components/app/myrw/datasets/DatasetsTab';
import DashboardsTab from 'components/app/myrw/dashboards/DashboardsTab';
import WidgetsTab from 'components/app/myrw/widgets/WidgetsTab';
import AreasTabs from 'components/app/myrw/areas';
import CollectionsTab from 'components/app/myrw/collections/CollectionsTab';

// constants
import { MYRW_TABS } from './constants';

class LayoutMyRW extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired
  };

  render() {
    const {
      user,
      query: { tab, subtab }
    } = this.props;
    const userName = user.name ? ` ${user.name.split(' ')[0]}` : '';
    const title = userName ? `Hi${userName}!` : 'My Resource Watch';
    const currentTab = tab || 'widgets';

    return (
      <Layout
        title="My Resource Watch"
        // TO-DO: fill description
        description="My Resource Watch Edit Profile description"
        pageHeader
      >
        <div className="c-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content -with-tabs">
                  <Title className="-primary -huge page-header-title">{title}</Title>
                  <Tabs
                    options={MYRW_TABS}
                    defaultSelected={currentTab}
                    selected={currentTab}
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
                {(currentTab === 'profile') && (<Profile />)}
                {(currentTab === 'datasets') && (<DatasetsTab tab={currentTab} subtab={subtab} />)}{' '}
                {(currentTab === 'dashboards') && (<DashboardsTab tab={currentTab} subtab={subtab} />)}
                {(currentTab === 'areas') && (<AreasTabs tab={currentTab} subtab={currentTab} />)}
                {(currentTab === 'widgets') && (<WidgetsTab tab={currentTab} subtab={subtab} />)}
                {(currentTab === 'collections') && (<CollectionsTab tab={currentTab} subtab={subtab} />)}
                {(currentTab !== 'profile') && (currentTab !== 'datasets') && (tab !== 'widgets') && (
                  <div className="c-button-container -j-center explore c-field-buttons">
                    <ul className="c-field-buttons">
                      <li />
                    </ul>
                    <Link route={currentTab !== 'dashboards' ? 'explore' : 'topics'}>
                      <a className="c-button -secondary">
                        {(currentTab !== 'dashboards') ?
                          'Explore Datasets' : 'Discover Topics'}
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

export default LayoutMyRW;
