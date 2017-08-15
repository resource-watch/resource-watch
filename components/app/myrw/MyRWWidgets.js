import React from 'react';
import PropTypes from 'prop-types';
import { StickyContainer, Sticky } from 'react-sticky';

// Components
import Aside from 'components/ui/Aside';

// My RW Widgets
import MyRWWidgetsStarred from 'components/app/myrw/widgets/MyRWWidgetsStarred';
import MyRWWidgetsMy from 'components/app/myrw/widgets/MyRWWidgetsMy';
import MyRWWidgetsEdit from 'components/app/myrw/widgets/MyRWWidgetsEdit';

// Constants
const MYRW_SUBTABS = [{
  label: 'Starred',
  value: 'starred',
  route: 'myrw',
  params: { tab: 'widgets', subtab: 'starred' }
}, {
  label: 'My widgets',
  value: 'my-widgets',
  route: 'myrw',
  params: { tab: 'widgets', subtab: 'my-widgets' }
}];

class MyRWWidgets extends React.Component {
  render() {
    const subtab = this.props.subtab || 'starred';
    const element = this.props.element;

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
                  <MyRWWidgetsStarred />
                }
                {subtab === 'my-widgets' && !element &&
                  <MyRWWidgetsMy />
                }
              </div>

            </div>
          </StickyContainer>
        </div>
      </div>
    );
  }
}

MyRWWidgets.propTypes = {
  subtab: PropTypes.string,
  element: PropTypes.string
};

export default MyRWWidgets;
