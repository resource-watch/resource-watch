import { connect } from 'react-redux';

import VisualizationComponent from './component';

export default connect(
  state => ({
    // Store
    authorization: state.user.token
  }),
  null
)(VisualizationComponent);
