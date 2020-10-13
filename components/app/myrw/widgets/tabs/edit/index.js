import { connect } from 'react-redux';

// constants
import { getRWAdapter } from 'constants/widget-editor';

// component
import MyRWWidgetEditTab from './component';

export default connect((state) => ({
  user: state.user,
  locale: state.common.locale,
  RWAdapter: getRWAdapter({ locale: state.common.locale }),
}), null)(MyRWWidgetEditTab);
