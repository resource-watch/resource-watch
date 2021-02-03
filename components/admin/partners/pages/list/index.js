import { connect } from 'react-redux';

// component
import PartnersIndex from './component';

export default connect(
  (state) => ({ user: state.user }),
  null,
)(PartnersIndex);
