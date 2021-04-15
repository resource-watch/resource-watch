import { connect } from 'react-redux';

// component
import MyDataComingSoon from './component';

export default connect(
  (state) => ({
    userToken: state.user.token,
  }),
  null,
)(MyDataComingSoon);
