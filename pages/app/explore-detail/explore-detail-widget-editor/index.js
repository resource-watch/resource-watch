import { connect } from 'react-redux';

import ExploreDetailWidgetEditorComponent from './explore-detail-widget-editor-component';

export default connect(
  state => ({
    dataset: state.exploreDetail.data,
    responsive: state.responsive
  }),
  null
)(ExploreDetailWidgetEditorComponent);
