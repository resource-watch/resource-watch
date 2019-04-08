import { connect } from 'react-redux';

// component
import LayoutEmbedTable from './component';

export default connect(
  state => ({ routes: state.routes }),
  null
)(LayoutEmbedTable);
