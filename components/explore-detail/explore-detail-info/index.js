import { connect } from 'react-redux';

import ExploreDetailHeaderComponent from './explore-detail-info-component';

export default connect(
  state => ({
    dataset: state.exploreDataset.data
  }),
  null
)(ExploreDetailHeaderComponent);
