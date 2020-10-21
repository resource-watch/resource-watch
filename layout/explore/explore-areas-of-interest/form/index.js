import { connect } from 'react-redux';

// actions
import {
  setIsDrawing,
  stopDrawing,
} from 'layout/explore/actions';

// component
import ExploreAreaForm from './component';

export default connect(
  (state) => ({
    isDrawing: state.explore.map.drawer.isDrawing,
  }),
  {
    setIsDrawing,
    stopDrawing,
  },
)(ExploreAreaForm);
