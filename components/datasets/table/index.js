import { connect } from 'react-redux';

// component
import DatasetsTable from './component';

export default connect(
  state => ({ user: state.user }),
  null
)(DatasetsTable);
