import { Component, createElement } from 'react';
import { connect } from 'react-redux';
import { activeContextLayers } from 'components/vis/globe-cesium/selectors';

// Actions
import { togglePosition } from 'components/vis/globe-cesium/actions';
import * as actions from './actions';
import * as reducers from './reducer';
import initialState from './initial-state';

import LayerCardComponent from './component';

const mapStateToProps = state => ({
  layerMenuPulse: state.layerMenuPulse,
  layerCardPulse: state.layerCardPulse,
  activeContextLayers: activeContextLayers(state)
});

class LayerCardContainer extends Component {
  render() {
    return createElement(LayerCardComponent, {
      ...this.props
    });
  }
}

export { actions, reducers, initialState };

export default connect(mapStateToProps, { ...actions, togglePosition })(LayerCardContainer);
