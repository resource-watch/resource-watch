import { connect } from 'react-redux';

import importSelector from './component';

export default connect(
  state => ({
    user: state.user,
    topics: state.topics.published.data
  }),
  null
)(importSelector);
