import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StickyContainer, Sticky } from 'react-sticky';

// Redux
import { connect } from 'react-redux';

// Components
import CollectionListAside from 'components/app/myrw/collection-list-aside';
import MyRWWidgetsMy from 'components/app/myrw/widgets/MyRWWidgetsMy';
import MyRWWidgetsStarred from 'components/app/myrw/widgets/MyRWWidgetsStarred';

// Constants
const WIDGET_SUBTABS = [{
  label: 'My widgets',
  value: 'my_wigets',
  route: 'myrw',
  params: { tab: 'widgets', subtab: 'my_widgets' }
}, {
  label: 'Favourites',
  value: 'favourites',
  route: 'myrw',
  params: { tab: 'widgets', subtab: 'favourites' }
}];

class WidgetsIndex extends PureComponent {
  static defaultProps = {
    subtab: 'my_widgets'
  };

  static propTypes = {
    id: PropTypes.string,
    subtab: PropTypes.string,
    user: PropTypes.object
  };

  render() {
    const { id, user, subtab } = this.props;
    return (
      <div className="c-widgets-index">
        <StickyContainer>
          <div className="row l-row">
            <div className="columns small-12 medium-3">
              <Sticky>
                {
                  ({ style }) => (
                    <div style={style}>
                      <CollectionListAside
                        additionalTabs={WIDGET_SUBTABS}
                        selected={subtab}
                      />
                    </div>
                  )
                }
              </Sticky>
            </div>

            <div className="columns small-12 medium-9">
              {subtab === 'starred' && user.id &&
                <MyRWWidgetsStarred user={user} dataset={id} embed />
              }

              {subtab === 'my_widgets' && user.id &&
                <MyRWWidgetsMy user={user} dataset={id} />
              }
            </div>

          </div>
        </StickyContainer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(WidgetsIndex);
