import { connect } from 'react-redux';

// component
import LayoutAbout from './component';

export default connect(
  (state) => ({ data: state.staticPages.about }),
  null,
)(LayoutAbout);
