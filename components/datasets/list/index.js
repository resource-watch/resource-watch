import { connect } from 'react-redux';

// Components
import DatasetListComponent from './component';

export default connect(
  state => ({
    user: state.user
  }),
  null
)(DatasetListComponent);
