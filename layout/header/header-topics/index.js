import { connect } from 'react-redux';

// actions
import * as actions from '../header-actions';

// selectors
import { parseTopics } from './selectors';

// component
import HeaderTopicsComponent from './component';

export default connect(
  state => ({
    header: state.header,
    topics: parseTopics(state)
  }),
  actions
)(HeaderTopicsComponent);
