import { Component, createElement } from 'react';
import { connect } from 'react-redux';

import * as actions from './actions';
import * as reducers from './reducer';
import initialState from './initial-state';

import LayerMenuDropdownComponent from './component';

const mapStateToProps = state => ({
  layerActive: state.pulse.layerActive
});

class LayerMenuDropdownContainer extends Component {
  render() {
    return createElement(LayerMenuDropdownComponent, {
      ...this.props
    });
  }
}

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(LayerMenuDropdownContainer);
