import { connect } from 'react-redux';

// component
import LayoutHome from './component';

export default connect(
  (state) => ({
    responsive: state.responsive,
  }),
  null,
)(LayoutHome);
