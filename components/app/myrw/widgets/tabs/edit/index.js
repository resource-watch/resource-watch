import { connect } from 'react-redux';

// constants
import {
  getRWAdapter,
} from 'utils/widget-editor';

// component
import MyRWWidgetEditTab from './component';

export default connect((state) => ({
  user: state.user,
  locale: state.common.locale,
  RWAdapter: getRWAdapter(state),
}), null)(MyRWWidgetEditTab);
