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
  const { datasetID } = props;

  const getDataset = () => {
    dispatch(setDatasetLoading(true));
    dispatch(setTagsLoading(true));

    fetchDataset(datasetID, { includes: 'metadata,layer,vocabulary' })
      .then((data) => {
        dispatch(setDataset(data));
        dispatch(setDatasetLoading(false));

        // Load tags
        const tags = data.vocabulary && data.vocabulary.find(v => v.name === 'knowledge_graph').tags;
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
        toastr.error('Error loading dataset data', error);
      });
  };

  useEffect(() => {
    if (datasetID) {
      getDataset();
    }
  }, [datasetID]);

  return (
    <ExploreDetailComponent
      {...state}
      {...props}
    />);
};

ExploreDetailContainer.propTypes = { datasetID: PropTypes.string };
ExploreDetailContainer.defaultProps = { datasetID: null };


export default connect(
  state => ({
    // Store
    datasetID: state.explore.datasets.selected
  }),
  actions
)(ExploreDetailContainer);
