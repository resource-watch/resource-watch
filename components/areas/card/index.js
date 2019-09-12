import { connect } from 'react-redux';

// actions
import { removeUserArea, getUserAreaLayerGroups } from 'redactions/user';

// selectors
import { getActiveAlerts } from './selectors';

// component
import AreaCard from './component';

export default connect(
  (state, props) => ({ activeAlerts: getActiveAlerts(state, props) }),
  {
    removeUserArea,
    getUserAreaLayerGroups
  }
)(AreaCard);
