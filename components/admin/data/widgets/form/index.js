import { connect } from 'react-redux';

// component
import WidgetForm from './component';

export default connect(
  state => ({
    widgetEditor: state.widgetEditor,
    locale: state.common.locale,
    newState: state.routes.query.id === 'new'
  }),
  null
)(WidgetForm);
