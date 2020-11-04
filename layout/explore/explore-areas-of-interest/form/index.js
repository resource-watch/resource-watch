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
    drawer: state.explore.map.drawer,
  }),
  {
    setIsDrawing,
    stopDrawing,
  },
)(ExploreAreaForm);
