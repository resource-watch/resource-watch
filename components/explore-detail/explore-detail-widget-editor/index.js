import { connect } from 'react-redux';

import ExploreDetailWidgetEditorComponent from './explore-detail-widget-editor-component';

export default connect(
  state => ({
    dataset: state.exploreDataset.data,
    responsive: state.responsive
  }),
  null
)(ExploreDetailWidgetEditorComponent);
