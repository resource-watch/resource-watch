import { Component, createElement } from 'react';
import { connect } from 'react-redux';

import * as actions from './actions';
import * as reducers from './reducer';
import initialState from './initial-state';

import LayerContainerComponent from './component';

const mapStateToProps = state => ({
  displayed: state.layerContainerPulse.displayed,
  layerActive: state.layerMenuPulse.layerActive
});

class LayerContainerContainer extends Component {
  render() {
    return createElement(LayerContainerComponent, {
      ...this.props
    });
  }
}

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(LayerContainerContainer);
