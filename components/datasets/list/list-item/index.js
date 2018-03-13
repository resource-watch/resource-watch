import { connect } from 'react-redux';

// Components
import DatasetListItemComponent from './component';

export default connect(
  state => ({
    user: state.user
  }),
  null
)(DatasetListItemComponent);
