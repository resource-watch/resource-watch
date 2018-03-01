import { connect } from 'react-redux';

import ExploreDetailRelatedToolsComponent from './explore-detail-related-tools-component';
import { relatedTools } from './explore-detail-related-tools-selectors';

export default connect(
  state => ({
    tools: relatedTools(state.exploreDetail.tools)
  }),
  null
)(ExploreDetailRelatedToolsComponent);
