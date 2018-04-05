import { connect } from 'react-redux';

import * as actions from './actions';
import * as reducers from './reducer';
import initialState from './initial-state';

import LayerMenuNativeComponent from './component';

const mapStateToProps = () => ({});

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(LayerMenuNativeComponent);
