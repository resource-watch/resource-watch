import { connect } from 'react-redux';

// components
import LayoutAttributionRequirements from './component';

export default connect(
  (state) => ({ data: state.staticPages['api-attribution-requirements'] }),
  null,
)(LayoutAttributionRequirements);
