import { connect } from 'react-redux';

// component
import WidgetsShow from './component';

// selectors
import { parseTabs } from './selectors';

export default connect(
  state => ({
    user: state.user,
    query: state.routes.query,
    tabs: parseTabs(state),
    dataset: state.routes.query.id
  }),
  null
)(WidgetsShow);
