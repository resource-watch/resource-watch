import { connect } from 'react-redux';

// actions
import { setDropdownOpened } from '../actions';

// component
import HeaderUserComponent from './component';

export default connect(
  state => ({
    header: state.header,
    user: state.user
  }),
  { setDropdownOpened }
)(HeaderUserComponent);
