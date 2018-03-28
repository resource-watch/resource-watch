import { Component, createElement } from 'react';
import { connect } from 'react-redux';

import * as actions from './actions';
import * as reducers from './reducer';
import initialState from './initial-state';

import LayerMenuNativeComponent from './component';

const mapStateToProps = state => ({
  layerActive: state.pulse.layerActive
});

class LayerMenuNativeContainer extends Component {
  render() {
    return createElement(LayerMenuNativeComponent, {
      ...this.props
    });
  }
}

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(LayerMenuNativeContainer);
