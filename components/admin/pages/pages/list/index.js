import { connect } from 'react-redux';

// component
import PagesIndex from './component';

export default connect(
  (state) => ({ user: state.user }),
  null,
)(PagesIndex);
