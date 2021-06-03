import { connect } from 'react-redux';

// actions
import { setMobileOpened } from '../actions';

// component
import HeaderMenuMobile from './component';

export default connect(
  (state) => ({
    header: state.header,
    user: state.user,
  }),
  { setMobileOpened },
)(HeaderMenuMobile);
