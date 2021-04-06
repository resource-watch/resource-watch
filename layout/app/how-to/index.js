import { connect } from 'react-redux';

// component
import LayoutHowTo from './component';

export default connect(
  (state) => ({ data: state.staticPages['how-to'] }),
  null,
)(LayoutHowTo);
