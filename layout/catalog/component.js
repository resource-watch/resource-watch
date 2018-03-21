/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { Router } from 'routes';

// Components
import Layout from 'layout/layout/layout-app';
import SearchInput from 'components/ui/SearchInput';
import Spinner from 'components/ui/Spinner';
import DatasetList from 'components/datasets/list';

// Utils
import { logEvent } from 'utils/analytics';

class CatalogComponent extends React.Component {
  static propTypes = {
    catalog: PropTypes.object.isRequired,

    // Actions
    getDatasets: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    // ------------------------ BINDINGS -----------------------
    this.handleSearch = debounce(this.handleSearch.bind(this), 500);
  }

  componentDidMount() {
    this.props.getDatasets();
  }

  handleSearch(value) {
    this.props.getDatasets(value);
    logEvent('Catalog page', 'search', value);
  }

  render() {
    const { loading, datasets } = this.props.catalog;

    return (
      <Layout
        title="Catalog"
        description=""
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
                  list={datasets}
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
