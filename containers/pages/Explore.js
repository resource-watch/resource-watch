import { connect } from 'react-redux';
import { toggleModal, setModalOptions } from 'rw-components';
import Explore from 'components/pages/Explore';
import { getDatasets, setDatasetsPage, setUrlParams, setDatasetsActive, setDatasetsHidden, setDatasetsFilters, toggleDatasetActive, getVocabularies } from 'redactions/explore';
import { redirectTo } from 'redactions/common';
import getpaginatedDatasets from 'selectors/explore/datasetsPaginatedExplore';
import getFilteredDatasets from 'selectors/explore/filterDatasets';
import getActiveLayers from 'selectors/explore/layersActiveExplore';

const mapStateToProps = (state) => {
  const datasets = state.explore.filters.length ?
    Object.assign({}, state.explore.datasets, { list: getFilteredDatasets(state) }) :
    state.explore.datasets;

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

export default connect(mapStateToProps, mapDispatchToProps)(Explore);
