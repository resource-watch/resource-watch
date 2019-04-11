import { connect } from 'react-redux';

// actions
import { setDropdownOpened } from '../actions';

// component
import AdminHeaderUser from './component';

export default connect(
  state => ({
    header: state.headerAdmin,
    user: state.user
  }),
  { setDropdownOpened }
)(AdminHeaderUser);
