import { connect } from 'react-redux';

// actions
import { setSearchOpened } from 'layout/header/actions';
import { setSearchPage, setSearchUrl, setSearchTerm, fetchSearch, setSearchSelected } from 'components/search-results/actions';

// selectors
import { selectedSearchItem } from './selectors';

// component
import SearchBar from './component';

export default connect(
  state => ({
    search: state.search,
    selected: selectedSearchItem(state),
    header: state.header
  }),
  {
    setSearchPage,
    setSearchUrl,
    setSearchTerm,
    fetchSearch,
    setSearchOpened,
    setSearchSelected
  }
)(SearchBar);
