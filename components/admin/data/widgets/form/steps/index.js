import { connect } from 'react-redux';

// utils
import {
  getRWAdapter,
} from 'utils/widget-editor';

// component
import Step1 from './component';

export default connect((state) => ({
  user: state.user,
  RWAdapter: getRWAdapter(state),
}), null)(Step1);
