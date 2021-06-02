import { connect } from 'react-redux';

// component
import MyDataComingSoon from './component';

export default connect(
  (state) => ({
    userEmail: state.user?.email,
  }),
  null,
)(MyDataComingSoon);
