import { connect } from 'react-redux';

// component
import BlogFeed from './component';

export default connect(
  state => ({ ...state.blog }),
  null
)(BlogFeed);
