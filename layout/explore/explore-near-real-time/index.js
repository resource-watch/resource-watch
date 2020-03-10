import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from 'layout/explore/actions';
import { toastr } from 'react-redux-toastr';

// services
import { fetchDatasets } from 'services/dataset';

// component
import ExploreNearRealTimeComponent from './component';

const ExploreNearRealTimeContainer = () => {
  const [datasets, setDatasets] = useState([]);

  useEffect(() => {
    fetchDatasets({ 'concepts[0][0]': 'near_real_time' })
      .then(data => setDatasets(data))
      .catch(error => toastr.error('Error loading Near-Real-Time datasets', error));
  }, []);

  return (
    <ExploreNearRealTimeComponent
      datasets={datasets}
    />);
};

ExploreNearRealTimeContainer.propTypes = { datasetID: PropTypes.string };
ExploreNearRealTimeContainer.defaultProps = { datasetID: null };


export default connect(
  null,
  actions
)(ExploreNearRealTimeContainer);
