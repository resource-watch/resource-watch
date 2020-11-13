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
  RWAdapter: getRWAdapter({
    locale: state.common.locale,
    ...state.user.token && {
      userToken: state.user.token.split(' ')[1],
    },
  }),
}), null)(MyRWWidgetEditTab);
