import { connect } from 'react-redux';
import * as actions from './actions';
import * as reducers from './reducers';
import initialState from './initial-state';

// component
import AdminHeader from './component';

export { actions, reducers, initialState };

export default connect(
  state => ({
    pageHeader: true,
    header: state.headerAdmin,
    responsive: state.responsive
  }),
  actions
)(AdminHeader);
