import { connect } from 'react-redux';
import {
  setSidebarSubsection,
  setSelectedItem,
  setAreaOfInterest,
} from 'layout/explore/actions';

// component
import ExploreAreasOfInterest from './component';

export default connect(
  (state) => ({
    token: state.user.token,
    aoi: state.explore.map.aoi,
  }),
  {
    setSidebarSubsection,
    setSelectedItem,
    setAreaOfInterest,
  },
)(ExploreAreasOfInterest);
