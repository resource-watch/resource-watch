import { connect } from 'react-redux';

import ExploreDetailHeaderComponent from './explore-detail-header-component';

export default connect(
  state => ({
    dataset: state.exploreDetail.data,
    user: state.user
  }),
  null
)(ExploreDetailHeaderComponent);
