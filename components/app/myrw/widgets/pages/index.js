import React from 'react';
import PropTypes from 'prop-types';
import { StickyContainer, Sticky } from 'react-sticky';

// Utils
import { substitution } from 'utils/utils';

// Redux
import { connect } from 'react-redux';

// Components
import Aside from 'components/ui/Aside';
import MyRWWidgetsMy from 'components/app/myrw/widgets/MyRWWidgetsMy';
import MyRWWidgetsStarred from 'components/app/myrw/widgets/MyRWWidgetsStarred';

// Constants
const WIDGET_SUBTABS = [{
  label: 'Starred',
  value: 'starred',
  route: 'myrw',
  params: { tab: 'widgets', subtab: 'starred' }
}, {
  label: 'My widgets',
  value: 'my_wigets',
  route: 'myrw',
  params: { tab: 'widgets', subtab: 'my_widgets' }
}];

class WidgetsIndex extends React.Component {
  render() {
    const { id, user } = this.props;
    const subtab = this.props.subtab || 'starred';

    return (
      <div className="c-widgets-index">
        <StickyContainer>
          <div className="row l-row">
            <div className="columns small-12 medium-3">
              <Sticky>
                {
                  ({ style }) => (
                    <div style={style}>
                      <Aside
                        items={WIDGET_SUBTABS}
                        selected={subtab}
                      />
                    </div>
                  )
                }
              </Sticky>
            </div>

            <div className="columns small-12 medium-9">
              {subtab === 'starred' &&
                <MyRWWidgetsStarred user={user} dataset={id} embed />
              }

              {subtab === 'my_widgets' &&
                <MyRWWidgetsMy user={user} dataset={id} />
              }
            </div>

          </div>
        </StickyContainer>
      </div>
    );
  }
}

WidgetsIndex.propTypes = {
  id: PropTypes.string,
  subtab: PropTypes.string,
  // Store
  user: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(WidgetsIndex);
