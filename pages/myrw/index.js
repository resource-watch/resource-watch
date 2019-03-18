import { connect } from 'react-redux';

// actions
import { getUserAreas } from 'redactions/user';

// component
import MyRWpage from './component';

export default connect(
  null,
  { getUserAreas }
)(MyRWpage);
