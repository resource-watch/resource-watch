import React, { Component } from 'react';
import debounce from 'lodash/debounce';

// components
import Layout from 'layout/layout/layout-app';
import SearchInput from 'components/ui/SearchInput';
import Spinner from 'components/ui/Spinner';
import DatasetList from 'components/datasets/list';
import Paginator from 'components/ui/Paginator';

// services
import { fetchDatasets } from 'services/dataset';

// utils
import { logEvent } from 'utils/analytics';
import { DATASETS_PER_PAGE } from './constants';

class CatalogLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      datasets: [],
      loading: true,
      search: null,
      page: 1,
      totalItems: 0
    };

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    this.getDatasets();
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.page !== nextState.page || this.state.search !== nextState.search) {
      this.getDatasets();
    }
  }

  getDatasets() {
    const { page, search } = this.state;

    this.setState({ loading: true });

    fetchDatasets(
      {
        'page[size]': DATASETS_PER_PAGE,
        'page[number]': page,
        status: 'saved',
        published: true,
        application: process.env.APPLICATIONS,
        language: 'en',
        includes: ['metadata', 'widget', 'layer', 'vocabulary'].join(','),
        search,
        sort: 'name,description'
      },
      {},
      true
    )
      .then((result) => {
        const { datasets, meta } = result;
        this.setState({
          datasets,
          totalItems: meta['total-items'],
          loading: false
        });
      })
      .catch((error) => {
        this.setState({
          loading: false
        });
      });
  }

  handleSearch() {
    debounce((value) => {
      this.setState({ search: value });
      logEvent('Catalog page', 'search', value);
    }, 500);
  }

  handlePageChange(page) {
    this.setState({ page });
  }

  render() {
    const { loading, datasets, page, totalItems } = this.state;

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
                <Spinner className="-light -relative" isLoading={loading} />
              </div>
            </div>

            <div className="row">
              <div className="column small-12">
                <DatasetList list={datasets} mode="list" />
              </div>
              <div className="column small-12">
                <Paginator
                  options={{
                    page,
                    limit: DATASETS_PER_PAGE,
                    size: totalItems
                  }}
                  onChange={this.handlePageChange}
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
