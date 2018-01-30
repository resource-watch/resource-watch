import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StickyContainer, Sticky } from 'react-sticky';

// Redux
import { connect } from 'react-redux';

// Components
import CollectionListAside from 'components/collection-list-aside';
import MyRWWidgetsMy from 'components/app/myrw/widgets/my-rw-widgets';

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
    subtab: PropTypes.string
  };

  render() {
    const { subtab } = this.props;
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
              <MyRWWidgetsMy />
            </div>

          </div>
        </StickyContainer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  subtab: state.routes.query.subtab
});

export default connect(mapStateToProps, null)(WidgetsIndex);
