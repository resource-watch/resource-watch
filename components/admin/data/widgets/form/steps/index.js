import { connect } from 'react-redux';

// constants
import {
  getRWAdapter,
} from 'utils/widget-editor';

// component
import Step1 from './component';

export default connect((state) => ({
  user: state.user,
  query: state.routes.query,
  RWAdapter: getRWAdapter({ locale: state.common.locale }),
}), null)(Step1);
