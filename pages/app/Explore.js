import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Autobind } from 'es-decorators';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import MediaQuery from 'react-responsive';
import 'isomorphic-fetch';
import ReactDOM from 'react-dom';
import DropdownTreeSelect from 'react-dropdown-tree-select';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import {
  toggleLayerGroupVisibility,
  toggleLayerGroup,
  setLayerGroupsOrder,
  setLayerGroupActiveLayer,
  setLayerGroups,
  getDatasets,
  setDatasetsPage,
  setDatasetsSearchFilter,
  setDatasetsTopicsFilter,
  setDatasetsGeographiesFilter,
  setDatasetsDataTypeFilter,
  setDatasetsFilteredByConcepts,
  setFiltersLoading
} from 'redactions/explore';
import { redirectTo } from 'redactions/common';
import { toggleModal, setModalOptions } from 'redactions/modal';

// Selectors
import getFilteredDatasets from 'selectors/explore/filterDatasets';
import getLayerGroups from 'selectors/explore/layersExplore';

// Components
import Sidebar from 'components/app/layout/Sidebar';
import DatasetListHeader from 'components/app/explore/DatasetListHeader';
import DatasetList from 'components/app/explore/DatasetList';
import Paginator from 'components/ui/Paginator';
import Map from 'components/vis/Map';
import ShareModalExplore from 'components/modal/ShareModalExplore';
import Legend from 'components/ui/Legend';
import Spinner from 'components/ui/Spinner';
import Icon from 'components/ui/Icon';
import SearchInput from 'components/ui/SearchInput';

// Layout
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';

// Utils
import LayerManager from 'utils/layers/LayerManager';

// Services
import DatasetService from 'services/DatasetService';

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
      showFilters: false
    };

    this.filters = {
      topics: [],
      geographies: [],
      dataType: []
    };

    // Services
    this.datasetService = new DatasetService(null, { apiURL: process.env.WRI_API_URL });

    // BINDINGS
    this.handleFilterDatasetsSearch = debounce(this.handleFilterDatasetsSearch.bind(this), 500);
  }

  componentWillMount() {
    const query = this.props.url.query;
    const { topics, geographies, dataType } = query || {};

    if (topics || geographies || dataType) {
      this.filters = {
        topics: topics ? JSON.parse(topics) : [],
        geographies: geographies ? JSON.parse(geographies) : [],
        dataType: dataType ? JSON.parse(dataType) : []
      };

      this.applyFilters();
    }
  }

  componentDidMount() {
    const query = this.props.url.query;
    if (query.page) {
      this.props.setDatasetsPage(+query.page);
    }

    if (query.layers) {
      try {
        const layerGroups = JSON.parse(decodeURIComponent(query.layers));
        this.props.setLayerGroups(layerGroups);
      } catch (e) {
        this.props.setLayerGroups([]);
      }
    }

    if (query.search) {
      this.props.setDatasetsSearchFilter({ value: query.search, key: 'name' });
    }

    if (query.topics) {
      this.props.setDatasetsTopicsFilter(JSON.parse(query.topics));
    }

    if (query.geographies) {
      this.props.setDatasetsGeographiesFilter(JSON.parse(query.geographies));
    }

    if (query.dataType) {
      this.props.setDatasetsDataTypeFilter(JSON.parse(query.dataType));
    }


    this.props.getDatasets();
    this.loadKnowledgeGraph();
  }

  componentWillReceiveProps(nextProps) {
    const oldFilters = this.props.explore.filters;
    const { topics, geographies, dataType } = oldFilters;
    const newFilters = nextProps.explore.filters;

    const conceptsUpdated = topics !== newFilters.topics ||
      geographies !== newFilters.geographies ||
      dataType !== newFilters.dataType;

    const newFiltersHaveData = (newFilters.topics && newFilters.topics.length > 0) ||
      (newFilters.dataType && newFilters.dataType.length > 0) ||
      (newFilters.geographies && newFilters.geographies.length > 0);

    if (conceptsUpdated && !newFiltersHaveData) {
      this.props.setDatasetsFilteredByConcepts([]);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps.explore, this.props.explore)
      || !isEqual(nextState, this.state);
  }

  loadKnowledgeGraph() {
    const query = this.props.url.query;
    const { topics, dataType, geographies } = query;

    // Topics selector
    fetch(new Request('/static/data/TopicsTreeLite.json', { credentials: 'same-origin' }))
      .then(response => response.json())
      .then((data) => {
        const element = document.getElementsByClassName('topics-selector')[0];

        const onChange = (currentNode, selectedNodes) => {
          this.filters.topics = selectedNodes.map(val => val.value);
        };


        if (topics) {
          data.forEach(child => this.selectElementsFromTree(child, topics));

          const topicsVal = JSON.parse(topics).map((type) => {
            const match = data.find(d => d.value === type) || {};
            return match.value;
          });

          this.filters.topics = topicsVal;
        }

        ReactDOM.render(
          <DropdownTreeSelect
            showDropdown
            placeholderText="Topics"
            data={data}
            onChange={onChange}
          />,
          element);
      });

    // Data types selector
    fetch(new Request('/static/data/DataTypesTreeLite.json', { credentials: 'same-origin' }))
      .then(response => response.json())
      .then((data) => {
        const element = document.getElementsByClassName('data-types-selector')[0];

        const onChange = (currentNode, selectedNodes) => {
          this.filters.dataType = selectedNodes.map(val => val.value);
        };

        if (dataType) {
          data.forEach(child => this.selectElementsFromTree(child, dataType));
          const dataTypesVal = JSON.parse(dataType).map((type) => {
            const match = data.find(d => d.value === type) || {};
            return match.value;
          });

          this.filters.dataTypes = dataTypesVal;
        }

        ReactDOM.render(
          <DropdownTreeSelect
            data={data}
            placeholderText="Data types"
            onChange={onChange}
          />,
          element);
      });

    // Geographies selector
    fetch(new Request('/static/data/GeographiesTreeLite.json', { credentials: 'same-origin' }))
      .then(response => response.json())
      .then((data) => {
        const element = document.getElementsByClassName('geographies-selector')[0];

        const onChange = (currentNode, selectedNodes) => {
          this.filters.geographies = selectedNodes.map(val => val.value);
        };

        if (geographies) {
          data.forEach(child => this.selectElementsFromTree(child, geographies));
          const geographiesVal = [];

          const searchFunction = (item) => {
            data.forEach((d) => {
              if (d.value === item) {
                geographiesVal.push(d.value);
              }

              if (d.children) {
                d.children.forEach((child) => {
                  if (child.value === item) geographiesVal.push(child.value);
                });
              }
            });
          };

          JSON.parse(geographies).forEach(geography => searchFunction(geography));

          this.filters.geographies = geographiesVal;
        }

        ReactDOM.render(
          <DropdownTreeSelect
            data={data}
            placeholderText="Geographies"
            onChange={onChange}
          />,
          element);
      });

    const hasSelectedValues = [
      ...(dataType || []),
      ...(geographies || []),
      ...(topics || [])
    ].length;

    // updates filters visibility based on selected values
    this.setState({
      showFilters: hasSelectedValues
    });
  }



  /**
   * Sets checked values for selector based on previous one chosen.
   *
   * @param {Object} tree used to populate selectors. Contains all options available.
   * @param {Object[]} elements Contains values to be selected in the data tree.
   */
  selectElementsFromTree(tree = {}, elements = []) { // eslint-disable-line class-methods-use-this
    if (elements.includes(tree.value)) {
      tree.checked = true; // eslint-disable-line no-param-reassign
    }
    (tree.children || []).forEach(child => {
      if (tree.checked) {
        child.checked = tree.checked;
      } else {
        this.selectElementsFromTree(child, elements)
      };
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

  handleShareModal() {
    const options = {
      children: ShareModalExplore,
      childrenProps: {
        url: window.location.href,
        layerGroups: this.props.rawLayerGroups,
        toggleModal: this.props.toggleModal
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }

  /**
   * Event handler executed when the user toggles the visibility
   * of a layer group in the legend
   * @param {LayerGroup} layerGroup
   */
  @Autobind
  onToggleLayerGroupVisibility(layerGroup) {
    this.props.toggleLayerGroupVisibility(layerGroup.dataset, !layerGroup.visible);
  }

  /**
   * Event handler executed when the user removes a layer
   * group from the map
   * @param {LayerGroup} layerGroup
   */
  @Autobind
  onRemoveLayerGroup(layerGroup) {
    this.props.removeLayerGroup(layerGroup.dataset);
  }

  /**
   * Event handler executed when the user re-orders the
   * layer groups
   * @param {string[]} datasets - List of datasets IDs
   */
  @Autobind
  onSetLayerGroupsOrder(datasets) {
    this.props.setLayerGroupsOrder(datasets);
  }

  /**
   * Event handler executed when the user change the active
   * layer of a layer group
   * @param {string} dataset - Dataset ID
   * @param {string} layer - Layer ID
   */
  @Autobind
  onSetLayerGroupActiveLayer(dataset, layer) {
    this.props.setLayerGroupActiveLayer(dataset, layer);
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

  applyFilters() {
    const { topics, geographies, dataType } = this.filters;
    const { page } = this.props.url.query || {};

    if (page !== 1) this.props.setDatasetsPage(1);

    // updates URL
    this.props.setDatasetsTopicsFilter(topics);
    this.props.setDatasetsGeographiesFilter(geographies);
    this.props.setDatasetsDataTypeFilter(dataType);


    this.props.setFiltersLoading(true);
    this.datasetService.searchDatasetsByConcepts(
      topics, geographies, dataType)
      .then((datasetList) => {
        this.props.setFiltersLoading(false);
        this.props.setDatasetsFilteredByConcepts(datasetList[0] || []);
      });
  }

  toggleFilters() {
    this.setState({
      showFilters: !this.state.showFilters
    });
  }

  render() {
    const { explore, totalDatasets, filteredDatasets } = this.props;
    const { search } = explore.filters;
    const { showFilters } = this.state;

    const buttonFilterContent = showFilters ? 'Hide filters' : 'Show filters';
    const filterContainerClass = classnames('filters-container', {
      '_is-hidden': !showFilters
    });

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
              <div className="row collapse">
                <div className="column small-12">
                  <h1>Explore</h1>
                  <div className="search-container">
                    <SearchInput
                      onSearch={this.handleFilterDatasetsSearch}
                      input={{
                        value: search && search.value,
                        placeholder: 'Search dataset'
                      }}
                    />
                  </div>
                  <div className="buttons -align-between">
                    {!!showFilters && <button
                      className="c-button -secondary"
                      onClick={() => this.applyFilters()}
                    >
                      Apply filters
                    </button>}
                    <button
                      className="c-button"
                      onClick={() => this.toggleFilters()}
                    >
                      {buttonFilterContent}
                    </button>
                  </div>
                  <div className={filterContainerClass}>
                    <div className="row">
                      <div className="column small-12">
                        <div className="c-tree-selector -explore topics-selector" />
                      </div>
                      <div className="column small-12">
                        <div className="c-tree-selector -explore geographies-selector " />
                      </div>
                      <div className="column small-12">
                        <div className="c-tree-selector -explore data-types-selector" />
                      </div>
                    </div>
                  </div>
                  <DatasetListHeader
                    list={totalDatasets}
                    mode={explore.datasets.mode}
                  />
                  <Spinner
                    isLoading={explore.datasets.loading || explore.filters.loading}
                    className="-light"
                  />

                  <div className="row collapse">
                    <div className="column small-12">
                      <DatasetList
                        list={filteredDatasets}
                        mode={explore.datasets.mode}
                        showActions
                      />
                    </div>
                  </div>

                  <Paginator
                    options={{
                      page: explore.datasets.page,
                      limit: explore.datasets.limit,
                      size: totalDatasets.length
                    }}
                    onChange={(page) => {
                      this.props.setDatasetsPage(page);
                      // Scroll to the top of the list
                      document.getElementsByClassName('sidebar-content')[0].scrollTop = 0;
                    }}
                  />
                </div>
              </div>
            </Sidebar>
            <MediaQuery minDeviceWidth={720} values={{ deviceWidth: 720 }}>
              <div className="l-map">
                <Map
                  LayerManager={LayerManager}
                  mapConfig={mapConfig}
                  layerGroups={this.props.layerGroups}
                />

                <button className="share-button" onClick={() => this.handleShareModal()}>
                  <Icon name="icon-share" className="-small" />
                </button>

                {this.props.layerGroups && this.props.layerGroups.length &&
                  <Legend
                    layerGroups={this.props.layerGroups}
                    className={{ color: '-dark' }}
                    toggleLayerGroupVisibility={this.onToggleLayerGroupVisibility}
                    setLayerGroupsOrder={this.onSetLayerGroupsOrder}
                    removeLayerGroup={this.onRemoveLayerGroup}
                    setLayerGroupActiveLayer={this.onSetLayerGroupActiveLayer}
                  />
                }
              </div>
            </MediaQuery>
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
  filteredDatasets: PropTypes.array,
  totalDatasets: PropTypes.array,
  layerGroups: PropTypes.array,
  toggledDataset: PropTypes.string,


  // ACTIONS

  getDatasets: PropTypes.func,
  setDatasetsPage: PropTypes.func,
  redirectTo: PropTypes.func,
  setDatasetsFilters: PropTypes.func,
  toggleModal: PropTypes.func,
  setModalOptions: PropTypes.func,

  // Toggle the visibility of a layer group based on the layer passed as argument
  toggleLayerGroupVisibility: PropTypes.func.isRequired,
  // Remove the layer group
  removeLayerGroup: PropTypes.func.isRequired,
  // Set the active layer of a layer group
  setLayerGroupActiveLayer: PropTypes.func.isRequired,
  // Set the layer groups
  setLayerGroups: PropTypes.func.isRequired
};

Explore.defaultProps = {
  filteredDatasets: [],
  totalDatasets: []
};

const mapStateToProps = (state) => {
  const { totalFilteredDatasets, filteredDatasets } = getFilteredDatasets(state);
  return {
    explore: state.explore,
    filteredDatasets,
    totalDatasets: totalFilteredDatasets,
    layerGroups: getLayerGroups(state),
    rawLayerGroups: state.explore.layers
  }
};

const mapDispatchToProps = dispatch => ({
  getDatasets: () => { dispatch(getDatasets()); },
  setDatasetsSearchFilter: search => dispatch(setDatasetsSearchFilter(search)),
  setDatasetsTopicsFilter: topics => dispatch(setDatasetsTopicsFilter(topics)),
  setDatasetsDataTypeFilter: dataType => dispatch(setDatasetsDataTypeFilter(dataType)),
  setDatasetsGeographiesFilter: geographies => dispatch(setDatasetsGeographiesFilter(geographies)),
  setDatasetsFilteredByConcepts: datasetList =>
    dispatch(setDatasetsFilteredByConcepts(datasetList)),
  setFiltersLoading: isLoading => dispatch(setFiltersLoading(isLoading)),
  redirectTo: (url) => { dispatch(redirectTo(url)); },
  toggleModal: (open, options) => dispatch(toggleModal(open, options)),
  setModalOptions: (options) => { dispatch(setModalOptions(options)); },
  setDatasetsPage: page => dispatch(setDatasetsPage(page)),
  toggleLayerGroupVisibility: (dataset, visible) => {
    dispatch(toggleLayerGroupVisibility(dataset, visible));
  },
  removeLayerGroup: dataset => dispatch(toggleLayerGroup(dataset, false)),
  setLayerGroupsOrder: datasets => dispatch(setLayerGroupsOrder(datasets)),
  setLayerGroupActiveLayer: (dataset, layer) => dispatch(setLayerGroupActiveLayer(dataset, layer)),
  setLayerGroups: layerGroups => dispatch(setLayerGroups(layerGroups))
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Explore);
