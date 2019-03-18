import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

// components
import Layout from 'layout/layout/layout-app';
import SearchInput from 'components/ui/SearchInput';
import Spinner from 'components/ui/Spinner';
import DatasetList from 'components/datasets/list';

// utils
import { logEvent } from 'utils/analytics';

class CatalogLayout extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    getDatasets: PropTypes.func.isRequired,
    setDatasetsSearch: PropTypes.func.isRequired
  };

  getSearchResults = debounce((value) => {
    const { getDatasets } = this.props;

    logEvent('Catalog page', 'search', value);
    getDatasets();
  }, 500);

  handleSearch = (value) => {
    const { setDatasetsSearch } = this.props;
    setDatasetsSearch(value);
    this.getSearchResults();
  }

  render() {
    const {
      loading,
      list
    } = this.props;

    return (
      <Layout
        title="Resource Watch Catalog"
        description="Check the whole list of datasets available in RW"
      >
        <div className="l-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <h1>Catalog</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="l-section">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="search-container">
                  <SearchInput
                    onSearch={this.handleSearch}
                    input={{ placeholder: 'Search dataset' }}
                    escapeText={false}
                  />
                </div>
              </div>
              <div className="column small-12">
                <Spinner
                  className="-light -relative"
                  isLoading={loading}
                />
              </div>
            </div>

            <div className="row">
              <div className="column small-12">
                <DatasetList
                  list={list}
                  mode="list"
                />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default CatalogLayout;
