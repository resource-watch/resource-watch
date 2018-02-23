import { connect } from 'react-redux';

// Components
import DatasetListComponent from './dataset-list-component';

export default connect(
  state => ({
    user: state.user
  }),
  null
)(DatasetListComponent);
