import { connect } from 'react-redux';
// actions
import { setDropdownOpened } from '../actions';

// component
import HeaderData from './component';

export default connect(
  (state) => ({ header: state.header }),
  { setDropdownOpened },
)(HeaderData);
