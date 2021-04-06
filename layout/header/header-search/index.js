import { connect } from 'react-redux';

// actions
import { setSearchOpened } from '../actions';

// component
import HeaderSearch from './component';

export default connect(
  null,
  { setSearchOpened },
)(HeaderSearch);
