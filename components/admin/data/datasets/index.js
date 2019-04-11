import { connect } from 'react-redux';

// component
import DatasetsTab from './component';

export default connect(
  state => ({
    user: state.user,
    id: state.routes.query.id
  }),
  null
)(DatasetsTab);
