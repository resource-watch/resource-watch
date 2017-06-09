import React from 'react';
import PropTypes from 'prop-types';

// Components
import Title from 'components/ui/Title';
import Sidebar from 'components/app/layout/Sidebar';
import DatasetListHeader from 'components/app/explore/DatasetListHeader';
import DatasetList from 'components/app/explore/DatasetList';
import Paginator from 'components/ui/Paginator';
import Map from 'components/vis/Map';
import ShareModal from 'components/modal/ShareModal';
import Legend from 'components/ui/Legend';
import CustomSelect from 'components/ui/CustomSelect';
import LayerManager from 'utils/layers/LayerManager';
import Spinner from 'components/ui/Spinner';
import Icon from 'components/ui/Icon';
import Page from 'components/app/layout/Page';
import { getDatasets, setDatasetsPage, setUrlParams, setDatasetsActive, setDatasetsHidden, setDatasetsFilters, toggleDatasetActive, getVocabularies } from 'redactions/explore';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import getpaginatedDatasets from 'selectors/explore/datasetsPaginatedExplore';
import getFilteredDatasets from 'selectors/explore/filterDatasets';
import getActiveLayers from 'selectors/explore/layersActiveExplore';
import { redirectTo } from 'redactions/common';
import { toggleModal, setModalOptions } from 'redactions/modal';

const mapConfig = {
  zoom: 3,
  latLng: {
    lat: 0,
    lng: 0
  }
};

class Explore extends React.Component {

  static async getInitialProps({ pathname }) {
    return { pathname };
  }

  constructor(props) {
    super(props);

    this.state = {
      layersActive: props.layersActive,
      vocabularies: props.explore.vocabularies.list || []
    };

    // Bindings
    this.handleRedirect = this.handleRedirect.bind(this);
    this.handleFilterDatasets = this.handleFilterDatasets.bind(this);
  }

  componentWillMount() {
    this.props.getDatasets();
    this.props.getVocabularies();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      layersActive: nextProps.layersActive,
      vocabularies: nextProps.explore.vocabularies.list
    });
  }

  handleRedirect(item) {
    if (item && item.value) {
      this.props.redirectTo(`explore/${item.value}`);
    }
  }

  handleFilterDatasets(item, levels, key) {
    const filter = item ? [{ levels, value: item.value, key }] : [];
    this.props.setDatasetsFilters(filter);
  }

  handleShareModal() {
    const options = {
      children: ShareModal,
      childrenProps: {
        url: window.location.href
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }

  render() {
    const { explore, paginatedDatasets } = this.props;
    const datasetsSearchList = explore.datasets.list.map(d => (
      {
        value: d.id,
        label: d.attributes.name
      }
    ));

    return (
      <Page
        title="Explore"
        description="Explore description"
        pathname={this.props.pathname}
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
                      <CustomSelect
                        options={datasetsSearchList}
                        onValueChange={this.handleRedirect}
                        onKeyPressed={this.handleFilterDatasets}
                        search
                        placeholder="Search dataset"
                        hideList
                      />
                    </div>
                    <div className="column small-12 medium-6">
                      <CustomSelect
                        options={this.state.vocabularies}
                        onValueChange={this.handleFilterDatasets}
                        placeholder="Select issue"
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
              />

              <Paginator
                options={{
                  page: explore.datasets.page,
                  limit: explore.datasets.limit,
                  size: explore.datasets.list.length
                }}
                onChange={page => this.props.setDatasetsPage(page)}
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
      </Page>
    );
  }
}

Explore.propTypes = {
  // STORE
  explore: PropTypes.object,
  paginatedDatasets: PropTypes.array,
  layersActive: PropTypes.array,
  toggledDataset: PropTypes.string,
  pathname: PropTypes.string,

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
  const datasets = state.explore.filters.length
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
  setDatasetsFilters: (filters) => { dispatch(setDatasetsFilters(filters)); },
  redirectTo: (url) => { dispatch(redirectTo(url)); },
  toggleModal: (open) => { dispatch(toggleModal(open)); },
  setModalOptions: (options) => { dispatch(setModalOptions(options)); },
  setDatasetsPage: (page) => {
    dispatch(setDatasetsPage(page));
    dispatch(setUrlParams());
  },
  toggleDatasetActive: (id) => {
    dispatch(toggleDatasetActive(id));
    dispatch(setUrlParams());
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Explore);
