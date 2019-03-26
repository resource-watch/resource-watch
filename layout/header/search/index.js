import { connect } from 'react-redux';

// actions
import { setSearchTerm, fetchSearch } from 'components/search-results/actions';
import { setSearchOpened } from '../actions';

// component
import HeaderSearch from './component';

export default connect(
  state => ({
    header: state.header,
    search: state.search
  }),
  {
    setSearchOpened,
    setSearchTerm,
    fetchSearch
  }
)(HeaderSearch);
