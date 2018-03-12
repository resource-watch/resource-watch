import { connect } from 'react-redux';

import ExploreDetailActionsComponent from './explore-detail-buttons-component';

export default connect(
  state => ({
    user: state.user,
    dataset: state.exploreDetail.data,
    partner: state.exploreDetail.partner.data
  }),
  null
)(ExploreDetailActionsComponent);
