import { connect } from 'react-redux';

import ExploreDetailInfoComponent from './explore-detail-info-component';

export default connect(
  state => ({
    dataset: state.exploreDetail.data
  }),
  null
)(ExploreDetailInfoComponent);
