import { connect } from 'react-redux';

// component
import ToolsShow from './component';

export default connect(
  (state) => ({
    user: state.user,
    id: state.routes.query.id,
  }),
  null,
)(ToolsShow);
