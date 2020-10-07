import { connect } from 'react-redux';

// actions
import { setIsDrawing } from 'layout/explore/actions';

// component
import ExploreAreaForm from './component';

export default connect(
  null,
  {
    setIsDrawing,
  },
)(ExploreAreaForm);
