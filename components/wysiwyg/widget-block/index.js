import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// helpers
import { belongsToACollection } from 'components/collections-panel/collections-panel-helpers';

// constants
import {
  getRWAdapter,
} from 'utils/widget-editor';

import * as actions from './actions';
import * as reducers from './reducers';
import initialState from './initial-state';

import WidgetBlockComponent from './component';

// mandatory
export { actions, reducers, initialState };

class WidgetBlock extends PureComponent {
  static propTypes = {
    item: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    setWidgetLoading: PropTypes.func.isRequired,
    setWidgetModal: PropTypes.func.isRequired,
    removeWidget: PropTypes.func.isRequired,
    setLayers: PropTypes.func.isRequired,
    RWAdapter: PropTypes.func.isRequired,
  };

  UNSAFE_componentWillMount() {
    if (this.props.item.content.widgetId) {
      this.triggerFetch(this.props);
      this.setFavourite(this.props);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.item.content.widgetId !== this.props.item.content.widgetId) {
      this.triggerFetch(nextProps);
      this.setFavourite(nextProps);
    }
  }

  componentWillUnmount() {
    const { item, removeWidget } = this.props;

    // resets widget
    removeWidget({ id: `${item.content.widgetId}/${item.id}` });
  }

  /**
   * HELPERS
   * - triggerFetch
   * - setFavourite
  */
  setFavourite = (props) => {
    const { item, user } = props;
    const favourite = belongsToACollection(user, item);

    props.setFavourite({
      id: `${item.content.widgetId}/${item.id}`,
      value: favourite || {}
    });
  }

  triggerFetch = props => props.getWidget({
    id: props.item.content.widgetId,
    itemId: props.item.id,
    includes: 'metadata'
  })

  render() {
    const { RWAdapter } = this.props;
    return (
      <WidgetBlockComponent
        RWAdapter={RWAdapter}
        onToggleModal={(modal) => {
          const { item } = this.props;

          this.props.setWidgetModal({
            id: `${item.content.widgetId}/${item.id}`,
            value: modal
          });
        }}
        onToggleLoading={(loading) => {
          const { item } = this.props;

          this.props.setWidgetLoading({
            id: `${item.content.widgetId}/${item.id}`,
            value: loading
          });
        }}
        onToggleLayerGroupVisibility={(layerGroup) => {
          const { data, item } = this.props;
          const layers = [...data[`${item.content.widgetId}/${item.id}`].layers];

          const layerGroups = layers.map((l) => {
            if (l.dataset !== layerGroup.dataset) return l;
            return Object.assign({}, l, { visible: !layerGroup.visible });
          });

          this.props.setLayers({
            id: `${item.content.widgetId}/${item.id}`,
            value: layerGroups
          });
        }}
        {...this.props}
      />
    );
  }
}

export default connect(
  (state) => ({
    data: state.widgetBlock,
    user: state.user,
    RWAdapter: getRWAdapter({ locale: state.common.locale }),
  }),
  actions,
)(WidgetBlock);
