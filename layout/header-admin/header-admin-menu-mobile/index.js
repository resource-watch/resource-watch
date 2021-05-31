import { connect } from 'react-redux';

// actions
import { setMobileOpened } from '../actions';

// component
import AdminHeaderMenuMobile from './component';

export default connect(
  (state) => ({
    header: state.headerAdmin,
  }),
  { setMobileOpened },
)(AdminHeaderMenuMobile);
