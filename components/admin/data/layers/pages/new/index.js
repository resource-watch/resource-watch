import { connect } from 'react-redux';

// component
import LayersNew from './component';

export default connect(
  (state) => ({
    user: state.user,
  }),
  null,
)(LayersNew);
