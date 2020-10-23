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
    RWAdapter: getRWAdapter({ locale: state.common.locale }),
  }),
  null,
)(VisualizationComponent);
