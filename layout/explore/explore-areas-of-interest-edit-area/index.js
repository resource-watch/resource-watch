import { connect } from 'react-redux';

// actions
import {
  clearSidebarSubsection,
  setSidebarSubsection,
} from 'layout/explore/actions';

// component
import ExploreAreasOfInterestEditArea from './component';

export default connect(
  (state) => ({
    token: state.user.token,
    selectedAoI: state.explore.sidebar.selected,
  }),
  {
    clearSidebarSubsection,
    setSidebarSubsection,
  },
)(ExploreAreasOfInterestEditArea);
