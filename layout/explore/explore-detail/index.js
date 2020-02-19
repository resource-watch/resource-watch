import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import * as actions from 'layout/explore/actions';

// services
import { fetchDataset } from 'services/dataset';

// component
import ExploreDetailComponent from './component';

// store
import reducer from './reducer';
import initialState from './initial-state';
import {
  setDataset,
  setLoading
} from './actions';

const ExploreDetailContainer = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { datasetID } = props;

  const getDataset = () => {
    dispatch(setLoading(true));

    fetchDataset(datasetID, { includes: 'metadata,layer,vocabulary' })
      .then((data) => {
        dispatch(setDataset(data));
        dispatch(setLoading(false));
      })
      .catch((error) => {
        dispatch(setLoading(false));
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
