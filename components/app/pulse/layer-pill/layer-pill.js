import { Component, createElement } from 'react';
import { connect } from 'react-redux';

import * as actions from './layer-pill-actions';
import * as reducers from './layer-pill-reducer';
import initialState from './layer-pill-initial-state';

import LayerPillComponent from './layer-pill-component';

const mapStateToProps = state => ({
  layerActive: state.pulse.layerActive
});

class LayerPillContainer extends Component {
  render() {
    return createElement(LayerPillComponent, {
      ...this.props
    });
  }
}

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(LayerPillContainer);
