import { connect } from 'react-redux';

// selectors
import { getUpdatedDataset } from './selectors';

// component
import ExploreDetailHeaderComponent from './explore-detail-header-component';

export default connect(
  state => ({
    dataset: getUpdatedDataset(state),
    user: state.user
  }),
  null
)(ExploreDetailHeaderComponent);
