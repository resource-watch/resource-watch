import { connect } from 'react-redux';

// component
import DatasetsNew from './component';

export default connect(
  (state) => ({ user: state.user }),
  null,
)(DatasetsNew);
