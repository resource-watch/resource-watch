import { connect } from 'react-redux';

import * as actions from './explore-detail-actions';
import * as reducers from './explore-detail-reducers';
import initialState from './explore-detail-default-state';

// component
import ExploreDetailComponent from './explore-detail-component';

// selectors
import { getDatasetThumbnail } from './selectors';

// mandatory
export { actions, reducers, initialState };

export default connect(
  state => ({
    exploreDetail: state.exploreDetail,
    thumbnail: getDatasetThumbnail(state)
  }),
  actions
)(ExploreDetailComponent);
