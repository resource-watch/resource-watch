import { connect } from 'react-redux';

// component
import DatasetsNew from './component';

// selectors
import { parseTabs } from './selectors';

export default connect(
  state => ({
    user: state.user,
    query: state.routes.query,
    tabs: parseTabs(state)
  }),
  null
)(DatasetsNew);
