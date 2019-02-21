import { connect } from 'react-redux';

// component
import AdminTopicsDetailLayout from './component';

export default connect(
  state => ({ topic: state.topics.detail.data }),
  null
)(AdminTopicsDetailLayout);
