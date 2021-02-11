import { connect } from 'react-redux';

// component
import PagesNew from './component';

export default connect(
  (state) => ({ user: state.user }),
  null,
)(PagesNew);
