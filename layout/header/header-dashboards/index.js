import { connect } from 'react-redux';

// actions
import { setDropdownOpened } from '../actions';

// selectors
import { parseTopics } from './selectors';

// component
import HeaderDashboardsComponent from './component';

export default connect(
  state => ({
    header: state.header,
    topics: parseTopics(state)
  }),
  { setDropdownOpened }
)(HeaderDashboardsComponent);
