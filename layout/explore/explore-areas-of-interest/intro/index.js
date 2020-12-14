import { connect } from 'react-redux';

// actions
import { setSidebarSection } from 'layout/explore/actions';

// component
import ExploreAreasOfInterestIntro from './component';

export default connect(
  null,
  {
    setSidebarSection,
  },
)(ExploreAreasOfInterestIntro);
