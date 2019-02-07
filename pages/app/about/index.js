import { connect } from 'react-redux';

// component
import AboutPage from './component';

export default connect(
  state => ({ data: state.staticPages.about }),
  null
)(AboutPage);
