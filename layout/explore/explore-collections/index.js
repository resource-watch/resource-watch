import { connect } from 'react-redux';

// component
import ExploreCollections from './component';

export default connect(
  (state) => ({
    token: state.user.token,
    selectedCollection: state.explore.sidebar.selectedCollection,
  }),
  null,
)(ExploreCollections);
