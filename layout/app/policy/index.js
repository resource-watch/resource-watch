import { connect } from 'react-redux';

// component
import LayoutPolicy from './component';

export default connect(
  (state) => ({ data: state.staticPages['privacy-policy'] }),
  null,
)(LayoutPolicy);
