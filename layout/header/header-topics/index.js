import { connect } from 'react-redux';

// actions
import * as actions from '../header-actions';

// selectors
import { getPublishedTopics } from './selectors';

// component
import HeaderTopicsComponent from './component';

export default connect(
  state => ({
    header: state.header,
    topics: getPublishedTopics(state)
  }),
  actions
)(HeaderTopicsComponent);
