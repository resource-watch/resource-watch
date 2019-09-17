// Redux
import { connect } from 'react-redux';
import { getAllTopics, setFilter } from 'modules/topics/actions';

// selectors
import { getTopics } from './selectors';

// component
import TopicsTable from './component';

export default connect(
  state => ({
    authorization: state.user.token,
    loading: state.topics.all.loading,
    topics: getTopics(state),
    error: state.topics.all.error
  }),
  {
    getAllTopics,
    setFilter
  }
)(TopicsTable);
