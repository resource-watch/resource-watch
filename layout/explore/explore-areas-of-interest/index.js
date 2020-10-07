import { connect } from 'react-redux';
import {
  setSidebarSubsection,
  setSelectedItem,
  setGeostore,
} from 'layout/explore/actions';

// component
import ExploreAreasOfInterest from './component';

export default connect(
  (state) => ({ token: state.user.token }),
  {
    setSidebarSubsection,
    setSelectedItem,
    setGeostore,
  },
)(ExploreAreasOfInterest);
