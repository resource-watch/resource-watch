import { connect } from 'react-redux';

// component
import WidgetForm from './component';

export default connect(
  state => ({
    locale: state.common.locale,
    newState: state.routes.query.id === 'new',
    dataset: state.routes.query.dataset
  }),
  null
)(WidgetForm);
