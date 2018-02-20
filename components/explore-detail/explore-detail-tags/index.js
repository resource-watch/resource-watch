import { connect } from 'react-redux';

import ExploreDetailTagsComponent from './explore-detail-tags-component';

export default connect(
  state => ({
    tags: state.exploreDataset.tags
  }),
  null
)(ExploreDetailTagsComponent);
