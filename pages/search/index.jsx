import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// actions
import * as actions from 'layout/search/search-actions';

// components
import Search from 'layout/search';

class SearchPage extends PureComponent {
  static propTypes = {
    term: PropTypes.string.isRequired,
    page: PropTypes.number.isRequired,
    setSearchTerm: PropTypes.func.isRequired,
    fetchSearch: PropTypes.func.isRequired,
  };

  static async getInitialProps({ store, query }) {
    const {
      dispatch,
    } = store;
    const {
      term,
      page,
    } = query;

    if (page) dispatch(actions.setSearchPage(+page));

    if (term) {
      dispatch(actions.setSearchTerm(term));
      await dispatch(actions.fetchSearch());
    }

    return {};
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { term: newTerm, page: newPage } = nextProps;
    const { term: oldTerm, page: oldPage } = this.props;

    if (
      newTerm !== oldTerm
      || newPage !== oldPage
    ) {
      window.scrollTo(0, 0);
      this.props.fetchSearch();
    }
  }

  componentWillUnmount() {
    // clears search results if we unmount the search view
    this.props.setSearchTerm('');
    this.props.fetchSearch();
  }

  render() {
    return (<Search />);
  }
}

export default connect(
  (state) => ({ ...state.search }),
  actions,
)(SearchPage);
