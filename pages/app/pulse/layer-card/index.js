import { Component, createElement } from 'react';
import { connect } from 'react-redux';

import * as actions from './actions';
import * as reducers from './reducer';
import initialState from './initial-state';

import LayerCardComponent from './component';

const mapStateToProps = state => ({
  layerMenuPulse: state.layerMenuPulse,
  layerCardPulse: state.layerCardPulse,
  user: state.user,
  locale: state.common.locale
});

class LayerCardContainer extends Component {
  render() {
    return createElement(LayerCardComponent, {
      ...this.props
    });
  }
}

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(LayerCardContainer);
