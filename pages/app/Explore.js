import 'isomorphic-fetch';

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Autobind } from 'es-decorators';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import MediaQuery from 'react-responsive';
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
  getFavoriteDatasets,
  setDatasetsPage,
  setDatasetsSearchFilter,
  setDatasetsTopicsFilter,
  setDatasetsGeographiesFilter,
  setDatasetsDataTypeFilter,
  setDatasetsFilteredByConcepts,
  setFiltersLoading,
  setTopicsTree,
  setGeographiesTree,
  setDataTypeTree,
  setZoom,
  setLatLng
} from 'redactions/explore';
import { redirectTo } from 'redactions/common';
import { toggleModal, setModalOptions } from 'redactions/modal';
import { setUser } from 'redactions/user';
import { setRouter } from 'redactions/routes';
import { Link } from 'routes';

// Selectors
import getFilteredDatasets from 'selectors/explore/filterDatasets';
import getLayerGroups from 'selectors/explore/layersExplore';

// Components
import Sidebar from 'components/app/layout/Sidebar';
import DatasetListHeader from 'components/app/explore/DatasetListHeader';
import DatasetList from 'components/app/explore/DatasetList';
import Paginator from 'components/ui/Paginator';
import Map from 'components/widgets/editor/map/Map';
import MapControls from 'components/widgets/editor/map/MapControls';
import BasemapControl from 'components/widgets/editor/map/controls/BasemapControl';
import ShareControl from 'components/widgets/editor/map/controls/ShareControl';
import Legend from 'components/widgets/editor/ui/Legend';
import Spinner from 'components/ui/Spinner';
import SearchInput from 'components/ui/SearchInput';

// Layout
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';

// Utils
import LayerManager from 'components/widgets/editor/helpers/LayerManager';
import { findTagInSelectorTree } from 'utils/explore/TreeUtil';

// Services
import DatasetService from 'services/DatasetService';

class Explore extends Page {
  static async getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const { user } = isServer ? req : store.getState();
    const url = { asPath, pathname, query };
    const botUserAgent = isServer && /AddSearchBot/.test(req.headers['user-agent']);
    store.dispatch(setUser(user));
    store.dispatch(setRouter(url));

    // We set the initial state of the map
    // NOTE: we can't move these two dispatch in
    // componentWillMount or componentDidMount
    // because the map only take into account its props
    // at instantiation (and we can't change that
    // without breaking panning and zooming)
    if (query.zoom) store.dispatch(setZoom(+query.zoom, false));
    if (query.latLng) {
      store.dispatch(setLatLng(JSON.parse(query.latLng), false));
    }

    if (isServer && botUserAgent) await store.dispatch(getDatasets({}));
    return { user, isServer, url, botUserAgent };
  }

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
    const { url, user } = this.props;
    const query = url.query;
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

    this.props.getDatasets({});
    if (user && user.id) {
      const token = user.token.includes('Bearer') ? user.token : `Bearer ${user.token}`;
      this.props.getFavoriteDatasets(token);
    }
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

    // ----- selectors' trees ----------------
    if (nextProps.explore.topicsTree) {
      this.topicsTree = nextProps.explore.topicsTree;
    }
    if (nextProps.explore.dataTypeTree) {
      this.dataTypeTree = nextProps.explore.dataTypeTree;
    }
    if (nextProps.explore.geographiesTree) {
      this.geographiesTree = nextProps.explore.geographiesTree;
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
        if (topics) {
          data.forEach(child => this.selectElementsFromTree(child, JSON.parse(topics)));

          const topicsVal = JSON.parse(topics).map((type) => {
            const match = data.find(d => d.value === type) || {};
            return match.value;
          });

          this.filters.topics = topicsVal;
        }

        // Save the topics tree as variable for later use
        this.props.setTopicsTree(data);
      });

    // Data types selector
    fetch(new Request('/static/data/DataTypesTreeLite.json', { credentials: 'same-origin' }))
      .then(response => response.json())
      .then((data) => {
        if (dataType) {
          data.forEach(child => this.selectElementsFromTree(child, JSON.parse(dataType)));
          const dataTypesVal = JSON.parse(dataType).map((type) => {
            const match = data.find(d => d.value === type) || {};
            return match.value;
          });

          this.filters.dataType = dataTypesVal;
        }

        // Save the data types tree as a variable for later use
        this.props.setDataTypeTree(data);
      });

    // Geographies selector
    fetch(new Request('/static/data/GeographiesTreeLite.json', { credentials: 'same-origin' }))
      .then(response => response.json())
      .then((data) => {
        if (geographies) {
          data.forEach(child => this.selectElementsFromTree(child, JSON.parse(geographies)));
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

        // Save the data types tree as variable for later use
        this.props.setGeographiesTree(data);
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
  selectElementsFromTree(tree = {}, elements = [], deselect = false) {
    let found = false; // We're using this loop because indexOf was finding elements
    // that were substrings, e.g. "co" and "economic" when only "economic" should have been found
    for (let i = 0; i < elements.length && !found; i++) {
      if (elements[i] === tree.value) {
        tree.checked = !deselect; // eslint-disable-line no-param-reassign
        found = true;
      }
    }

    (tree.children || []).forEach((child) => {
      this.selectElementsFromTree(child, elements, deselect);
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

  @Autobind
  handleTagSelected(tag) {
    const { geographies, dataType, topics } = this.filters;
    const { topicsTree } = this.props.explore;

    // clear previous selection
    if (topics.length && topics.length > 0) {
      this.topicsTree.forEach(child => this.selectElementsFromTree(child, topics, true));
    }

    if (findTagInSelectorTree(topicsTree, tag)) {
      this.topicsTree.forEach(child => this.selectElementsFromTree(child, [tag]));
      this.filters = { topics: [tag], geographies, dataType };
      this.applyFilters();
    }
  }

  applyFilters() {
    const { topics, geographies, dataType } = this.filters;
    const { page } = this.props.url.query || {};
    const hasValues = [...topics, ...geographies, ...dataType].length;

    if (page !== 1) this.props.setDatasetsPage(1);

    // updates URL
    this.props.setDatasetsTopicsFilter(topics);
    this.props.setDatasetsGeographiesFilter(geographies);
    this.props.setDatasetsDataTypeFilter(dataType);

    if (!hasValues) {
      this.props.setDatasetsFilteredByConcepts([]);
      return;
    }

    this.props.setFiltersLoading(true);
    this.datasetService.searchDatasetsByConcepts(
      topics, geographies, dataType)
      .then((datasetList) => {
        this.props.setFiltersLoading(false);
        this.props.setDatasetsFilteredByConcepts(datasetList || []);
      });
  }

  toggleFilters() {
    this.setState({
      showFilters: !this.state.showFilters
    });
  }

  /**
   * Return the center of the map as the user sees it
   * (if the sidebar is opened, the center is displaced)
   * @returns { lat: number, lng: number }
   */
  getPerceivedMapCenter() {
    const { explore } = this.props;

    const isOpenedSidebar = explore.sidebar.open;
    if (!isOpenedSidebar || !this.map) {
      return explore.latLng;
    }

    const { latLng, sidebar } = explore;
    const sidebarWidth = sidebar.width;
    const center = this.map.latLngToContainerPoint([latLng.lat, latLng.lng]);
    const newCenter = [center.x + sidebarWidth / 2, center.y];

    return this.map.containerPointToLatLng(newCenter);
  }

  render() {
    // It will render a list of links for AddSearch Bot
    if (this.props.botUserAgent) {
      return (
        <ul>
          {this.props.totalDatasets.map(d =>
            (<li key={d.id}>
              <Link
                route="explore_detail"
                params={{ id: d.id }}
              >
                <a>{d.attributes.name}</a>
              </Link>
            </li>)
          )}
        </ul>
      );
    }

    const { explore, totalDatasets, filteredDatasets } = this.props;
    const { search } = explore.filters;
    const { geographiesTree, topicsTree, dataTypeTree, zoom, latLng } = explore;
    const { showFilters } = this.state;
    const { topics, geographies, dataType } = this.filters;
    const topicsLabels = topics.map(topic => findTagInSelectorTree(topicsTree, topic).label);
    const geographiesLabels = geographies.map(geography =>
      findTagInSelectorTree(geographiesTree, geography).label);
    const dataTypeLabels = dataType.map(dType => findTagInSelectorTree(dataTypeTree, dType).label);

    const allTagsSt = [].concat(topicsLabels).concat(geographiesLabels)
      .concat(dataTypeLabels).join(', ');
    const filtersSumUp = !showFilters && allTagsSt.length > 0 ? `Filtering by ${allTagsSt}` : '';

    const buttonFilterContent = showFilters ? 'Hide filters' : 'Show filters';
    const filterContainerClass = classnames('filters-container', {
      '_is-hidden': !showFilters
    });

    const showFiltersClassName = classnames({
      'c-btn': true,
      '-b': !showFilters,
      '-a': showFilters
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
            <Sidebar ref={(node) => { this.sidebar = node; }}>
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
                    <button
                      className={showFiltersClassName}
                      onClick={() => this.toggleFilters()}
                    >
                      {buttonFilterContent}
                    </button>
                  </div>
                  <div className="filters-sum-up">
                    {filtersSumUp}
                  </div>
                  <div className={filterContainerClass}>
                    <div className="row">
                      <div className="column small-12">
                        <div className="c-tree-selector -explore topics-selector">
                          {topicsTree &&
                            <DropdownTreeSelect
                              showDropdown
                              placeholderText="Topics"
                              data={this.topicsTree || { label: '', value: '', children: [] }}
                              onChange={(currentNode, selectedNodes) => {
                                this.filters.topics = selectedNodes.map(val => val.value);
                                const deselect = !selectedNodes.includes(currentNode);
                                if (deselect) {
                                  this.topicsTree.forEach(child => this.selectElementsFromTree(
                                    child, [currentNode.value], deselect));
                                } else {
                                  this.topicsTree.forEach(child => this.selectElementsFromTree(
                                    child, this.filters.topics, deselect));
                                }
                                this.applyFilters();
                              }}
                            />
                          }
                        </div>
                      </div>
                      <div className="column small-12">
                        <div className="c-tree-selector -explore geographies-selector ">
                          {geographiesTree &&
                            <DropdownTreeSelect
                              data={this.geographiesTree || { label: '', value: '', children: [] }}
                              placeholderText="Geographies"
                              onChange={(currentNode, selectedNodes) => {
                                this.filters.geographies = selectedNodes.map(val => val.value);
                                const deselect = !selectedNodes.includes(currentNode);
                                if (deselect) {
                                  this.geographiesTree.forEach(child => this.selectElementsFromTree(
                                    child, [currentNode.value], deselect));
                                } else {
                                  this.geographiesTree.forEach(child => this.selectElementsFromTree(
                                    child, this.filters.geographies, deselect));
                                }
                                this.applyFilters();
                              }}
                            />
                          }
                        </div>
                      </div>
                      <div className="column small-12">
                        <div className="c-tree-selector -explore data-types-selector">
                          {dataTypeTree &&
                            <DropdownTreeSelect
                              data={this.dataTypeTree || { label: '', value: '', children: [] }}
                              placeholderText="Data types"
                              onChange={(currentNode, selectedNodes) => {
                                this.filters.dataType = selectedNodes.map(val => val.value);
                                const deselect = !selectedNodes.includes(currentNode);
                                if (deselect) {
                                  this.dataTypeTree.forEach(child => this.selectElementsFromTree(
                                    child, [currentNode.value], deselect));
                                } else {
                                  this.dataTypeTree.forEach(child => this.selectElementsFromTree(
                                    child, this.filters.dataType, deselect));
                                }
                                this.applyFilters();
                              }}
                            />
                          }
                        </div>
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
                        favorites={explore.datasets.favorites}
                        mode={explore.datasets.mode}
                        showActions
                        onTagSelected={this.handleTagSelected}
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
                  mapConfig={{ zoom, latLng }}
                  layerGroups={this.props.layerGroups}
                  setMapParams={params => this.props.setMapParams(params)}
                  setMapInstance={(map) => { this.map = map; }}
                />

                <MapControls>
                  <ShareControl
                    zoom={zoom}
                    latLng={this.getPerceivedMapCenter()}
                    layerGroups={this.props.rawLayerGroups}
                  />
                  <BasemapControl />
                </MapControls>

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

  getDatasets: PropTypes.func.isRequired,
  getFavoriteDatasets: PropTypes.func.isRequired,
  setDatasetsPage: PropTypes.func.isRequired,
  redirectTo: PropTypes.func.isRequired,
  setDatasetsFilters: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired,
  setTopicsTree: PropTypes.func.isRequired.isRequired,
  setDataTypeTree: PropTypes.func.isRequired.isRequired,
  setGeographiesTree: PropTypes.func.isRequired.isRequired,

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
  };
};

const mapDispatchToProps = dispatch => ({
  getDatasets: () => { dispatch(getDatasets({})); },
  getFavoriteDatasets: (token) => { dispatch(getFavoriteDatasets(token)); },
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
  setLayerGroups: layerGroups => dispatch(setLayerGroups(layerGroups)),
  setTopicsTree: tree => dispatch(setTopicsTree(tree)),
  setGeographiesTree: tree => dispatch(setGeographiesTree(tree)),
  setDataTypeTree: tree => dispatch(setDataTypeTree(tree)),
  setZoom: (zoom, updateUrl) => dispatch(setZoom(zoom, updateUrl)),
  setLatLng: (latLng, updateUrl) => dispatch(setLatLng(latLng, updateUrl)),
  setMapParams: debounce((params) => { // Debounce for performance reasons
    dispatch(setZoom(params.zoom));
    dispatch(setLatLng(params.latLng));
  }, 1000)
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Explore);
