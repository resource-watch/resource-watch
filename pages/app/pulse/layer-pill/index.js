import { Component, createElement } from 'react';
import { connect } from 'react-redux';

import * as actions from './actions';
import * as reducers from './reducer';
import initialState from './initial-state';

import LayerPillComponent from './component';

const mapStateToProps = state => ({
  contextLayersPulse: state.contextLayersPulse
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
