// Redux
import { connect } from 'react-redux';
import * as actions from './actions';
<<<<<<< HEAD
import * as reducers from './reducers';
=======
import * as reducers from './explore-reducers';
>>>>>>> [Mapbox]: Adds zoom controls, share control, search control
import initialState from './initial-state';

import ExploreEmbedComponent from './explore-embed-component';

// Mandatory
export { actions, reducers, initialState };

export default connect(
  state => ({ responsive: state.responsive }),
  actions
)(ExploreEmbedComponent);
