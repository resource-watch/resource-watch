import { connect } from 'react-redux';

import WidgetDetailHeaderComponent from './widget-detail-header-component';

export default connect(
  state => ({
    widget: state.widgetDetail.data,
    user: state.user
  }),
  null
)(WidgetDetailHeaderComponent);
