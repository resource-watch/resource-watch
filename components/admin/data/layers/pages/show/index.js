import { connect } from 'react-redux';

// component
import LayersShow from './component';

export default connect(
  (state) => ({
    user: state.user,
    dataset: state.routes.query.id,
  }),
  null,
)(LayersShow);
