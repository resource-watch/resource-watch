import { connect } from 'react-redux';

// component
import HeadApp from './component';

export default connect(
  state => ({ routes: state.routes }),
  null
)(HeadApp);
