// Redux
import { connect } from 'react-redux';
import UserReportComponent from './component';

export default connect(
  state => ({
    routes: state.routes
  }),
  null
)(UserReportComponent);
