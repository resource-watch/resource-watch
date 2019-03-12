import { connect } from 'react-redux';

// component
import AdminTopicsDetailLayout from './component';

export default connect(
  state => ({
    query: state.routes.query,
    user: state.user
  }),
  null
)(AdminTopicsDetailLayout);
