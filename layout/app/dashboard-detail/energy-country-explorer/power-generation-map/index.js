import { connect } from 'react-redux';

// actions
import {
  setBounds,
  resetExplore,
} from 'layout/explore/actions';

// component
import PowerGenerationMap from './component';

export default connect(
  null,
  {
    setBounds,
    resetExplore,
  },
)(PowerGenerationMap);
