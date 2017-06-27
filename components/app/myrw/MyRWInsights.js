import React from 'react';
import { StickyContainer, Sticky } from 'react-sticky';

// Components
import Aside from 'components/ui/Aside';

// My RW Insights
import MyRWInsightsStarred from 'components/app/myrw/insights/MyRWInsightsStarred';
import MyRWInsightsMy from 'components/app/myrw/insights/MyRWInsightsMy';

// Constants
const MYRW_SUBTABS = [{
  label: 'Starred',
  value: 'starred',
  route: 'myrw',
  params: { tab: 'insights', subtab: 'starred' }
}, {
  label: 'My insights',
  value: 'my-insights',
  route: 'myrw',
  params: { tab: 'insights', subtab: 'my-insights' }
}];

class MyRWInsights extends React.Component {
  render() {
    const subtab = this.props.subtab || 'starred';

    return (
      <div className="c-page-section">
        <div className="l-container">
          <StickyContainer>
            <div className="row l-row">
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
                  <MyRWInsightsStarred />
                }


                {subtab === 'my-insights' &&
                  <MyRWInsightsMy />
                }
              </div>

            </div>
          </StickyContainer>
        </div>
      </div>
    );
  }
}

MyRWInsights.propTypes = {
  subtab: React.PropTypes.string
};

export default MyRWInsights;
