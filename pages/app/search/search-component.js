/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Components
import Layout from 'components/layout/layout/layout-app';
import Spinner from 'components/ui/Spinner';

// Search components
import SearchList from './search-list';

class SearchComponent extends React.PureComponent {
  static propTypes = {
    term: PropTypes.string,
    loading: PropTypes.boolean
  }

  render() {
    const { term, loading } = this.props;

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
                  <h1>Search: {term}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="l-section">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <SearchList />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default SearchComponent;
