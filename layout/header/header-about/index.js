import { connect } from 'react-redux';
import { setDropdownOpened } from '../actions';

// component
import HeaderAbout from './component';

export default connect(
  state => ({ header: state.header }),
  { setDropdownOpened }
)(HeaderAbout);
