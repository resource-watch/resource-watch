import { Component, createElement } from 'react';
import { connect } from 'react-redux';

import * as actions from './actions';
import * as reducers from './reducer';
import initialState from './initial-state';

import LabelsPillComponent from './component';

const mapStateToProps = state => ({ labelsPulse: state.labelsPulse });

class LabelsPillContainer extends Component {
  render() {
    return createElement(LabelsPillComponent, { ...this.props });
  }
}

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(LabelsPillContainer);
