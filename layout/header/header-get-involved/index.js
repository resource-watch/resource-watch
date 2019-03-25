import { connect } from 'react-redux';

// actions
import { setDropdownOpened } from '../actions';

// component
import HeaderGetInvolved from './component';

export default connect(
  state => ({ header: state.header }),
  { setDropdownOpened }
)(HeaderGetInvolved);
