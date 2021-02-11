import { connect } from 'react-redux';

// actions
import { setSearchTerm } from '../actions';

// component
import SearchMobile from './component';

export default connect(
  (state) => ({ header: state.header }),
  { setSearchTerm },
)(SearchMobile);
