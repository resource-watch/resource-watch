import { connect } from 'react-redux';

// component
import FaqsShow from './component';

export default connect(
  (state) => ({
    user: state.user,
    id: state.routes.query.id,
  }),
)(FaqsShow);
