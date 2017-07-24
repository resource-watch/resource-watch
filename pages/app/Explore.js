import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import debounce from 'lodash/debounce';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getDatasets, setDatasetsPage, setUrlParams, setDatasetsActive, setDatasetsHidden,
  setDatasetsSearchFilter, setDatasetsIssueFilter, toggleDatasetActive, getVocabularies } from 'redactions/explore';
import { redirectTo } from 'redactions/common';
import { toggleModal, setModalOptions } from 'redactions/modal';

// Selectors
import getpaginatedDatasets from 'selectors/explore/datasetsPaginatedExplore';
import getFilteredDatasets from 'selectors/explore/filterDatasets';
import getActiveLayers from 'selectors/explore/layersActiveExplore';

// Components
import Title from 'components/ui/Title';
import Sidebar from 'components/app/layout/Sidebar';
import DatasetListHeader from 'components/app/explore/DatasetListHeader';
import DatasetList from 'components/app/explore/DatasetList';
import Paginator from 'components/ui/Paginator';
import Map from 'components/vis/Map';
import ShareModalExplore from 'components/modal/ShareModalExplore';
import Legend from 'components/ui/Legend';
import CustomSelect from 'components/ui/CustomSelect';
import Spinner from 'components/ui/Spinner';
import Icon from 'components/ui/Icon';
import SearchInput from 'components/ui/SearchInput';

// Layout
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';

// Utils
import LayerManager from 'utils/layers/LayerManager';


const mapConfig = {
  zoom: 3,
  latLng: {
    lat: 0,
    lng: 0
  }
};

class Explore extends Page {
  constructor(props) {
    super(props);

    this.state = {
      layersActive: props.layersActive,
      vocabularies: props.explore.vocabularies.list || []
    };

    // BINDINGS
    this.handleFilterDatasetsSearch = debounce(this.handleFilterDatasetsSearch.bind(this), 500);
    this.handleFilterDatasetsIssue = this.handleFilterDatasetsIssue.bind(this);
  }

  componentWillMount() {
    if (this.props.url.query.page) {
      this.props.setDatasetsPage(+this.props.url.query.page);
    }

    if (this.props.url.query.active) {
      this.props.setDatasetsActive(this.props.url.query.active.split(','));
    }

    if (this.props.url.query.search) {
      this.props.setDatasetsSearchFilter({ value: this.props.url.query.search, key: 'name' });
    }

    if (this.props.url.query.issue) {
      this.props.setDatasetsIssueFilter(JSON.parse(this.props.url.query.issue));
    }

    this.props.getDatasets();
    this.props.getVocabularies();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      layersActive: nextProps.layersActive,
      vocabularies: nextProps.explore.vocabularies.list
    });
  }

  @Autobind
  handleRedirect(item) {
    if (item && item.value) {
      this.props.redirectTo(`explore/${item.value}`);
    }
  }

  handleFilterDatasetsSearch(value) {
    const filter = { value: value || '', key: 'name' };
    this.props.setDatasetsSearchFilter(filter);

    // We move the user to the first page
    this.props.setDatasetsPage(1);
  }

  handleFilterDatasetsIssue(item, levels, key) {
    const filter = item ? [{ levels, value: item.value, key }] : null;
    this.props.setDatasetsIssueFilter(filter);

    // We move the user to the first page
    this.props.setDatasetsPage(1);
  }

  handleShareModal() {
    const options = {
      children: ShareModalExplore,
      childrenProps: {
        url: window.location.href,
        layers: this.props.layersActive
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }

  /**
   * Return the current value of the vocabulary filter
   * @returns {string}
   */
  getCurrentVocabularyFilter() {
    const filters = this.props.explore.filters;
    if (!filters.length) return null;

    const filter = filters.find(f => f.key === 'vocabulary');

    return filter && filter.value;
  }

  /**
   * Return the current search made on the name of the
   * datasets
   * @returns {string}
   */
  getCurrentNameFilter() {
    const filters = this.props.explore.filters;
    if (!filters.length) return null;

    const filter = filters.find(f => f.key === 'name');

    return filter && filter.value;
  }

  render() {
    const { explore, paginatedDatasets } = this.props;
    const datasetsSearchList = explore.datasets.list.map(d => (
      {
        value: d.id,
        label: d.attributes.name
      }
    ));
    const { search, issue } = explore.filters;

    return (
      <Layout
        title="Explore"
        description="Explore description"
        url={this.props.url}
        user={this.props.user}
      >
        <div className="p-explore">
          <div className="c-page -dark">
            <Sidebar>
              <div className="intro">
                <div className="row collapse">
                  <div className="column small-12">
                    <Title className="-primary -huge">
                      Explore
                    </Title>
                  </div>
                </div>
                <div className="search-container">
                  <div className="row collapse">
                    <div className="column small-12 medium-6">
                      <SearchInput
                        onSearch={this.handleFilterDatasetsSearch}
                        input={{
                          value: search && search.value,
                          placeholder: 'Search dataset'
                        }}
                      />
                    </div>
                    <div className="column small-12 medium-6">
                      <CustomSelect
                        options={this.state.vocabularies}
                        onValueChange={this.handleFilterDatasetsIssue}
                        placeholder="Select issue"
                        value={issue && issue.length > 0 && issue[0].value}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DatasetListHeader
                list={explore.datasets.list}
                mode={explore.datasets.mode}
              />
              <Spinner
                isLoading={explore.datasets.loading}
                className="-light"
              />
              <DatasetList
                active={explore.datasets.active}
                list={paginatedDatasets}
                mode={explore.datasets.mode}
                showActions
              />

              <Paginator
                options={{
                  page: explore.datasets.page,
                  limit: explore.datasets.limit,
                  size: explore.datasets.list.length
                }}
                onChange={(page) => {
                  this.props.setDatasetsPage(page);
                  // Scroll to the top of the list
                  document.getElementsByClassName('sidebar-content')[0].scrollTop = 0;
                }}
              />
            </Sidebar>

            <Map
              LayerManager={LayerManager}
              mapConfig={mapConfig}
              layersActive={this.state.layersActive}
              toggledDataset={this.props.toggledDataset}
            />

            <button className="share-button" onClick={() => this.handleShareModal()}>
              <Icon name="icon-share" className="-small" />
            </button>

            {this.state.layersActive && this.state.layersActive.length &&
              <Legend
                layersActive={this.state.layersActive}
                layersHidden={this.props.explore.datasets.hidden}
                className={{ color: '-dark' }}
                setDatasetsActive={this.props.setDatasetsActive}
                toggleDatasetActive={this.props.toggleDatasetActive}
                setDatasetsHidden={this.props.setDatasetsHidden}
                toggleModal={this.props.toggleModal}
                setModalOptions={this.props.setModalOptions}
              />
            }
          </div>
        </div>
      </Layout>
    );
  }
}

Explore.propTypes = {
  // ROUTER
  url: PropTypes.object,

  // STORE
  explore: PropTypes.object,
  paginatedDatasets: PropTypes.array,
  layersActive: PropTypes.array,
  toggledDataset: PropTypes.string,

  // ACTIONS
  getDatasets: PropTypes.func,
  getVocabularies: PropTypes.func,
  setDatasetsPage: PropTypes.func,
  redirectTo: PropTypes.func,
  setDatasetsActive: PropTypes.func,
  setDatasetsHidden: PropTypes.func,
  setDatasetsFilters: PropTypes.func,
  toggleModal: PropTypes.func,
  setModalOptions: PropTypes.func,
  toggleDatasetActive: PropTypes.func
};

const mapStateToProps = (state) => {
  const datasets = (state.explore.filters.search || state.explore.filters.issue)
    ? Object.assign({}, state.explore.datasets, { list: getFilteredDatasets(state) })
    : state.explore.datasets;

  const explore = Object.assign({}, state.explore, { datasets });

  return {
    explore,
    paginatedDatasets: getpaginatedDatasets(explore),
    allDatasets: state.explore.datasets.list,
    layersActive: getActiveLayers(state)
  };
};

const mapDispatchToProps = dispatch => ({
  getDatasets: () => { dispatch(getDatasets()); },
  getVocabularies: () => { dispatch(getVocabularies()); },
  setDatasetsActive: (active) => { dispatch(setDatasetsActive(active)); },
  setDatasetsHidden: (hidden) => { dispatch(setDatasetsHidden(hidden)); },
  setDatasetsSearchFilter: (search) => {
    dispatch(setDatasetsSearchFilter(search));
    if (typeof window !== 'undefined') dispatch(setUrlParams());
  },
  setDatasetsIssueFilter: (issue) => {
    dispatch(setDatasetsIssueFilter(issue));
    if (typeof window !== 'undefined') dispatch(setUrlParams());
  },
  redirectTo: (url) => { dispatch(redirectTo(url)); },
  toggleModal: (open) => { dispatch(toggleModal(open)); },
  setModalOptions: (options) => { dispatch(setModalOptions(options)); },
  setDatasetsPage: (page) => {
    dispatch(setDatasetsPage(page));
    if (typeof window !== 'undefined') dispatch(setUrlParams());
  },
  toggleDatasetActive: (id) => {
    dispatch(toggleDatasetActive(id));
    if (typeof window !== 'undefined') dispatch(setUrlParams());
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Explore);
