import { connect } from 'react-redux';

// actions
import { setDropdownOpened } from '../actions';

// selectors
import { parseTopics } from './selectors';

// component
import HeaderTopicsComponent from './component';

export default connect(
  state => ({
    header: state.header,
    topics: parseTopics(state)
  }),
  { setDropdownOpened }
)(HeaderTopicsComponent);
