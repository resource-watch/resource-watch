// Redux
import { connect } from 'react-redux';
import * as actions from './explore-detail-actions';
import * as reducers from './explore-detail-reducers';
import initialState from './explore-detail-default-state';

import ExploreDetailComponent from './explore-detail-component';

// selectors
import { getDatasetThumbnail } from './selectors';

// Mandatory
export {
  actions, reducers, initialState
};

export default connect(
  state => ({
    // Store
    exploreDetail: state.exploreDetail,
    thumbnail: getDatasetThumbnail(state)
  }),
  actions
)(ExploreDetailComponent);
