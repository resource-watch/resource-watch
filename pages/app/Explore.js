import React from 'react';
import PropTypes from 'prop-types';
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
  setDatasetsFilteredByConcepts
} from 'redactions/explore';
import { redirectTo } from 'redactions/common';
import { toggleModal, setModalOptions } from 'redactions/modal';

// Selectors
import getpaginatedDatasets from 'selectors/explore/datasetsPaginatedExplore';
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
import FiltersResume from 'components/app/explore/FiltersResume';

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
      filters: {
        topics: [],
        geographies: [],
        dataTypes: []
      }
    };

    // Services
    this.datasetService = new DatasetService(null, { apiURL: process.env.WRI_API_URL });

    // BINDINGS
    this.handleFilterDatasetsSearch = debounce(this.handleFilterDatasetsSearch.bind(this), 500);
  }

  componentWillMount() {
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
  }

  componentDidMount() {
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

    if (conceptsUpdated && newFiltersHaveData) {
      this.datasetService.searchDatasetsByConcepts(
        newFilters.topics, newFilters.geographies, newFilters.dataType)
        .then((datasetList) => {
          this.props.setDatasetsFilteredByConcepts(datasetList);
        });
    } else if (conceptsUpdated && !newFiltersHaveData) {
      this.props.setDatasetsFilteredByConcepts(null);
    }

    // this.setState({
    //   vocabularies: nextProps.explore.vocabularies.list
    // });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps.explore, this.props.explore)
      || !isEqual(nextState, this.state);
  }

  loadKnowledgeGraph() {
    const query = this.props.url.query;
    const { topics, dataType, geographies } = query;

    // Topics selector
    fetch(new Request('/static/data/TopicsTreeLite.json'))
      .then(response => response.json())
      .then((data) => {
        const element = document.getElementsByClassName('topics-selector')[0];

        const onChange = (currentNode, selectedNodes) => {
          const topicsVal = selectedNodes.map(val => val.value);
          const topicLabels = selectedNodes.map(val => val.label);
          this.props.setDatasetsTopicsFilter(topicsVal);
          this.setState({
            filters: {...this.state.filters, topics: topicLabels }
          });
        };

        if (topics) {
          data.forEach(child => this.selectElementsFromTree(child, topics));

          const topicLabels = JSON.parse(topics).map(type => {
            const match = data.find(d => d.value === type) || {};

            return match.label;
          });

          this.setState({
            filters: {...this.state.filters, topics: topicLabels }
          });
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
    fetch(new Request('/static/data/DataTypesTreeLite.json'))
      .then(response => response.json())
      .then((data) => {
        const element = document.getElementsByClassName('data-types-selector')[0];

        const onChange = (currentNode, selectedNodes) => {
          const dataTypesVal = selectedNodes.map(val => val.value);
          const dataTypesLabels = selectedNodes.map(val => val.label);
          this.setState({
            filters: {...this.state.filters, dataTypes: dataTypesLabels }
          });
          this.props.setDatasetsDataTypeFilter(dataTypesVal);
        };

        if (dataType) {
          data.forEach(child => this.selectElementsFromTree(child, dataType));
          const dataTypesLabels = JSON.parse(dataType).map(type => {
            const match = data.find(d => d.value === type) || {};

            return match.label;
          });

          this.setState({
            filters: {...this.state.filters, dataTypes: dataTypesLabels }
          });
        }

        ReactDOM.render(
          <DropdownTreeSelect
            data={data}
            placeholderText="Data types"
            onChange={onChange}
          />,
          element);
      });

    // Data types selector
    fetch(new Request('/static/data/GeographiesTreeLite.json'))
      .then(response => response.json())
      .then((data) => {
        const element = document.getElementsByClassName('geographies-selector')[0];

        const onChange = (currentNode, selectedNodes) => {
          const geographiesVal = selectedNodes.map(val => val.value);
          const geographiesLabels = selectedNodes.map(val => val.label);
          this.setState({
            filters: {...this.state.filters, geographies: geographiesLabels }
          });
          this.props.setDatasetsGeographiesFilter(geographiesVal);
        };

        if (geographies) {
          data.forEach(child => this.selectElementsFromTree(child, JSON.parse(geographies)));
          let geographyLabels = [];

          const searchFunction = (item) => {
            data.forEach(d => {
              if (d.value === item) {
                geographyLabels.push(d.label);
              };

              if (d.children) {
                d.children.forEach(child => {
                  if(child.value === item) geographyLabels.push(child.label);
                });
              }
            });
          };

          JSON.parse(geographies).forEach(geography => searchFunction(geography));

          this.setState({
            filters: {...this.state.filters, geographies: geographyLabels }
          });
        }

        ReactDOM.render(
          <DropdownTreeSelect
            data={data}
            placeholderText="Geographies"
            onChange={onChange}
          />,
          element);
      });
  }

  selectElementsFromTree(tree = {}, elements = []) {
    if (elements.includes(tree.value)) {
      tree.checked = true;
    }

    (tree.children || []).forEach(child => child.checked = tree.checked);
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

  render() {
    const { explore, paginatedDatasets } = this.props;
    const { search,  } = explore.filters;
    const { filters } = this.state;
    const { topics, geographies, dataTypes } = filters;

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
                    <div className="filters-container">
                      <div className="row">
                        <div className="column medium-4">
                          <div className="c-tree-selector -explore topics-selector" />
                        </div>
                        <div className="column medium-4">
                          <div className="c-tree-selector -explore geographies-selector " />
                        </div>
                        <div className="column medium-4">
                          <div className="c-tree-selector -explore data-types-selector" />
                        </div>
                      </div>
                  </div>
                  <FiltersResume
                    topics={topics}
                    geographies={geographies}
                    dataTypes={dataTypes}
                  />
                  <DatasetListHeader
                    list={explore.datasets.list}
                    mode={explore.datasets.mode}
                  />
                  <Spinner
                    isLoading={explore.datasets.loading}
                    className="-light"
                  />

                  <div className="row collapse">
                    <div className="column small-12">
                      <DatasetList
                        list={paginatedDatasets}
                        mode={explore.datasets.mode}
                        showActions
                      />
                    </div>
                  </div>

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
  paginatedDatasets: PropTypes.array,
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

const mapStateToProps = (state) => {
  const filters = state.explore.filters;
  const datasets = (filters.search || filters.topics || filters.geographies || filters.dataType)
    ? Object.assign({}, state.explore.datasets, { list: getFilteredDatasets(state) })
    : state.explore.datasets;

  const explore = Object.assign({}, state.explore, { datasets });

  return {
    explore,
    paginatedDatasets: getpaginatedDatasets(explore),
    allDatasets: state.explore.datasets.list,
    layerGroups: getLayerGroups(state),
    rawLayerGroups: state.explore.layers
  };
};

const mapDispatchToProps = dispatch => ({
  getDatasets: () => { dispatch(getDatasets()); },
  setDatasetsSearchFilter: search => dispatch(setDatasetsSearchFilter(search)),
  setDatasetsTopicsFilter: topics => dispatch(setDatasetsTopicsFilter(topics)),
  setDatasetsDataTypeFilter: dataType => dispatch(setDatasetsDataTypeFilter(dataType)),
  setDatasetsGeographiesFilter: geographies => dispatch(setDatasetsGeographiesFilter(geographies)),
  setDatasetsFilteredByConcepts: datasetList =>
    dispatch(setDatasetsFilteredByConcepts(datasetList)),
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
