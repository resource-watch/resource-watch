import { connect } from 'react-redux';

// component
import HeadApp from './component';

export default connect(
  (state) => ({
    hostname: state.common.hostname,
  }),
  null,
)(HeadApp);
