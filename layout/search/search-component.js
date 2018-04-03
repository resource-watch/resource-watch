/* eslint max-len: 0 */
import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';

// Components
import Layout from 'layout/layout/layout-app';
import Spinner from 'components/ui/Spinner';

// Search components
import SearchResults from 'components/search/search-results';
import SearchTerm from 'components/search/search-term';

class SearchComponent extends React.PureComponent {
  static propTypes = {
    search: PropTypes.shape({
      term: PropTypes.string,
      loading: PropTypes.bool
    })
  }

  render() {
    const { term, loading } = this.props.search;

    return (
      <Layout
        title="Search"
        description="Resource Watch Search"
        className="page-search"
        pageHeader
      >
        {loading && <Spinner isLoading className="-light" />}

        <div className="l-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <h1>Search{term && `: ${term}`}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="l-section">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <SearchTerm />
                <SearchResults />
              </div>
            </div>
          </div>
        </div>

      </Layout>
    );
  }
}

export default connect(
  state => ({
    search: state.search
  }),
  null
)(SearchComponent);
