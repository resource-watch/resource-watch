import { connect } from 'react-redux';

import ExploreDetailWidgetEditorComponent from './explore-detail-widget-editor-component';

export default connect(
  state => ({
    user: state.user,
    dataset: state.exploreDetail.data,
    responsive: state.responsive
  }),
  null
)(ExploreDetailWidgetEditorComponent);
