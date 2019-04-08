import { Component, createElement } from 'react';
import { connect } from 'react-redux';

import * as actions from './actions';
import * as reducers from './reducer';
import initialState from './initial-state';

import LayerMenuComponent from './component';

const mapStateToProps = state => ({
  responsive: state.responsive,
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
