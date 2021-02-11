import { connect } from 'react-redux';

// actions
import { setSearchPage, setSearchUrl } from './actions';

// component
import SearchResults from './component';

export default connect(
  (state) => ({ search: state.search }),
  ({
    setSearchPage,
    setSearchUrl,
  }),
)(SearchResults);
