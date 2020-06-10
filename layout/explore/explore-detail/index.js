import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import * as actions from 'layout/explore/actions';

// services
import { fetchDataset } from 'services/dataset';
import { fetchInferredTags } from 'services/graph';

// Helpers
import { TAGS_BLACKLIST } from 'utils/tags';

// component
import ExploreDetailComponent from './component';

// store
import reducer from './reducer';
import initialState from './initial-state';
import {
  setDataset,
  setDatasetLoading,
  setTags,
  setTagsLoading
} from './actions';

const ExploreDetailContainer = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { 
    datasetID,
    anchor,
    onDatasetLoaded,
    layerGroups,
    toggleMapLayerGroup
  } = props;

  useEffect(() => {
    if (datasetID) {
      dispatch(setDatasetLoading(true));
      dispatch(setTagsLoading(true));

      fetchDataset(datasetID, { includes: 'metadata,layer,vocabulary,widget' })
        .then((data) => {
          dispatch(setDataset(data));
          dispatch(setDatasetLoading(false));

          // Notifying the parent about the dataset load
          onDatasetLoaded(data);

          // Check if there's an anchor value so that the interface scrolls
          // to that section
          const element = document.getElementById(anchor);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }

          // Set default layer as active when Explore Detail has been 
          // directly loaded from the URL (no user navigation involved)
          const datasetHasLayers = data.layer.length > 0;
          if (layerGroups.length === 0 && datasetHasLayers) {
            toggleMapLayerGroup({ dataset: data, toggle: true });
          }

          // Load tags
          const knowledgeGraphVoc = data.vocabulary && data.vocabulary.find(v => v.name === 'knowledge_graph');
          const tags = knowledgeGraphVoc && knowledgeGraphVoc.tags;
          if (tags) {
            fetchInferredTags({ concepts: tags.join(',') })
              .then((inferredTags) => {
                dispatch(setTags(inferredTags.filter(tag =>
                  tag.labels.find(type => type === 'TOPIC' || type === 'GEOGRAPHY') &&
                  !TAGS_BLACKLIST.includes(tag.id))));
                dispatch(setTagsLoading(false));
              })
              .catch((error) => {
                toastr.error('Error loading dataset inferred tags', error);
                dispatch(setTagsLoading(false));
              });
          }
        })
        .catch((error) => {
          dispatch(setDatasetLoading(false));
          toastr.error('Error loading dataset data');
          console.error('Error loading dataset data', error);
        });
    }
  }, [anchor, datasetID]);


  useEffect(() => {
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [anchor]);

  return (
    <ExploreDetailComponent
      {...state}
      {...props}
    />);
};

ExploreDetailContainer.propTypes = {
  datasetID: PropTypes.string.isRequired,
  anchor: PropTypes.string.isRequired,
  onDatasetLoaded: PropTypes.func.isRequired
};

export default connect(
  state => ({
    // Store
    datasetID: state.explore.datasets.selected,
    anchor: state.explore.sidebar.anchor,
    layerGroups: state.explore.map.layerGroups
  }),
  actions
)(ExploreDetailContainer);
