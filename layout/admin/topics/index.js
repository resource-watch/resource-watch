import { connect } from 'react-redux';

// component
import AdminTopicsLayout from './component';

export default connect(
  state => ({ query: state.routes.query }),
  null
)(AdminTopicsLayout);
