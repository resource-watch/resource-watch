import { connect } from 'react-redux';

// actions
import {
  clearSidebarSubsection,
  setSidebarSubsection,
  stopDrawing,
  setPreviewAoi,
  setAreaOfInterest,
} from 'layout/explore/actions';

// component
import ExploreAreasOfInterestNewArea from './component';

export default connect(
  (state) => ({
    token: state.user.token,
    drawer: state.explore.map.drawer,
  }),
  {
    clearSidebarSubsection,
    setSidebarSubsection,
    stopDrawing,
    setPreviewAoi,
    setAreaOfInterest,
  },
)(ExploreAreasOfInterestNewArea);
