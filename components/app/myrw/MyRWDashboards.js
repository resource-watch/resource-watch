import React from 'react';
import { StickyContainer, Sticky } from 'react-sticky';

// Components
import Aside from 'components/ui/Aside';

// My RW Dashboards
import MyRWDashboardsStarred from 'components/app/myrw/dashboards/MyRWDashboardsStarred';
import MyRWDashboardsMy from 'components/app/myrw/dashboards/MyRWDashboardsMy';

// Constants
const MYRW_SUBTABS = [{
  label: 'Starred',
  value: 'starred',
  route: 'myrw',
  params: { tab: 'dashboards', subtab: 'starred' }
}, {
  label: 'My dashboards',
  value: 'my-dashboards',
  route: 'myrw',
  params: { tab: 'dashboards', subtab: 'my-dashboards' }
}];

class MyRWDashboards extends React.Component {
  render() {
    const subtab = this.props.subtab || 'starred';

    return (
      <div className="c-page-section">
        <div className="l-container">
          <StickyContainer>
            <div className="row custom-row">
              <div className="columns small-12 medium-3">
                <Sticky>
                  {
                    ({ style }) => (
                      <div style={style}>
                        <Aside
                          items={MYRW_SUBTABS}
                          selected={subtab}
                        />
                      </div>
                    )
                  }
                </Sticky>
              </div>

              <div className="columns small-12 medium-9">
                {subtab === 'starred' &&
                  <MyRWDashboardsStarred />
                }


                {subtab === 'my-dashboards' &&
                  <MyRWDashboardsMy />
                }
              </div>

            </div>
          </StickyContainer>
        </div>
      </div>
    );
  }
}

MyRWDashboards.propTypes = {
  subtab: React.PropTypes.string
};

export default MyRWDashboards;
