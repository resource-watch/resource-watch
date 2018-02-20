import { Component, createElement } from 'react';
import { connect } from 'react-redux';

import * as actions from './layer-menu-actions';
import * as reducers from './layer-menu-reducer';
import initialState from './layer-menu-initial-state';

import LayerMenuComponent from './layer-menu-component';

const mapStateToProps = state => ({
  layerActive: state.pulse.layerActive
});

class LayerMenuContainer extends Component {
  render() {
    return createElement(LayerMenuComponent, {
      ...this.props
    });
  }
}

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(LayerMenuContainer);
