/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

// Components
import Layout from 'layout/layout/layout-app';
import SearchInput from 'components/ui/SearchInput';
import Spinner from 'components/ui/Spinner';
import DatasetList from 'components/datasets/list';

// Utils
import { logEvent } from 'utils/analytics';

class CatalogComponent extends React.Component {
  static propTypes = {
    list: PropTypes.array,
    loading: PropTypes.bool,

    fetchDatasets: PropTypes.func,
    setDatasetsSearch: PropTypes.func
  };

  handleSearch = (value) => {
    this.props.setDatasetsSearch(value);
    this.fetchDatasets();
  }

  fetchDatasets = debounce((value) => {
    logEvent('Catalog page', 'search', value);
    this.props.fetchDatasets();
  }, 500);


  render() {
    const { loading, list } = this.props;

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
                    input={{
                      placeholder: 'Search dataset'
                    }}
                    escapeText={false}
                  />
                </div>
              </div>
              <div className="column small-12">
                <Spinner isLoading={loading} className="-light -relative" />
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

export default CatalogComponent;
