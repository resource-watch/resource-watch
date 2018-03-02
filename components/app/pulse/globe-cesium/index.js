import { Component, createElement } from 'react';
import { connect } from 'react-redux';
import { activeContextLayers } from './selectors';

import * as actions from './actions';
import * as reducers from './reducer';
import initialState from './initial-state';

import GlobeCesiumComponent from './component';

const mapStateToProps = state => ({
  activeContextLayers: activeContextLayers(state)
});

class GlobeCesiumContainer extends Component {
  render() {
    return createElement(GlobeCesiumComponent, {
      ...this.props
    });
  }
}

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(GlobeCesiumContainer);
