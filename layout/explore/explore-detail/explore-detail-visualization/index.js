import { connect } from 'react-redux';

// constants
import {
  getRWAdapter,
} from 'utils/widget-editor';

// component
import VisualizationComponent from './component';

export default connect(
  (state) => ({
    authorization: state.user.token,
    aoi: state.explore.map.aoi,
    RWAdapter: getRWAdapter(state),
  }),
  null,
)(VisualizationComponent);
