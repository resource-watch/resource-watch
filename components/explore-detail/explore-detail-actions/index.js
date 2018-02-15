import { connect } from 'react-redux';

import ExploreDetailActionsComponent from './explore-detail-actions-component';

export default connect(
  state => ({
    user: state.user,
    dataset: state.exploreDataset.data,
    partner: state.exploreDataset.partner.data
  }),
  null
)(ExploreDetailActionsComponent);
