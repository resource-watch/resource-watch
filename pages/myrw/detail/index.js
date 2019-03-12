import { connect } from 'react-redux';

// actions
import { getUserAreas } from 'redactions/user';

// component
import MyRWDetailPage from './component';

export default connect(
  null,
  { getUserAreas }
)(MyRWDetailPage);
