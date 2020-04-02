import { connect } from 'react-redux';

// component
import DatasetLayersComponent from './component';

// selectors
import { 
  isATimelineDataset,
  getTimelineLayer,
  getTimelineLayerMapbox
} from './selectors';

export default connect(
  (state, props) => ({
    isATimeline: isATimelineDataset(state, props),
    // When there exists a layer witht the new Mapbox implementation of the timeline, this
    // layer should take precedence
    timelineLayerMapbox: getTimelineLayerMapbox(state, props),
    timelineLayer: getTimelineLayer(state, props),
  }),
  null
)(DatasetLayersComponent);
