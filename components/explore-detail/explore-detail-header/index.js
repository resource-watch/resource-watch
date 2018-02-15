import { connect } from 'react-redux';

import ExploreDetailHeaderComponent from './explore-detail-header-component';

export default connect(
  state => ({
    dataset: state.exploreDataset.data,
    user: state.user
  }),
  null
)(ExploreDetailHeaderComponent);
