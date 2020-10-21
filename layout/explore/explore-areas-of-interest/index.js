import { connect } from 'react-redux';
import {
  setSidebarSubsection,
  setSelectedItem,
  toggleArea,
} from 'layout/explore/actions';

// selectors
import { getAreaIds } from './selectors';

// component
import ExploreAreasOfInterest from './component';

export default connect(
  (state) => ({
    token: state.user.token,
    areasOnMap: getAreaIds(state),
  }),
  {
    setSidebarSubsection,
    setSelectedItem,
    toggleArea,
  },
)(ExploreAreasOfInterest);
