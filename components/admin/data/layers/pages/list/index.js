import { connect } from 'react-redux';

// component
import LayersIndex from './component';

export default connect(
  (state) => ({
    user: state.user,
  }),
  null,
)(LayersIndex);
