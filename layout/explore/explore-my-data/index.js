import { connect } from 'react-redux';

// component
import ExploreMyData from './component';

export default connect(
  (state) => ({
    userToken: state.user.token,
  }),
  null,
)(ExploreMyData);
