import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from 'layout/explore/actions';
import { toastr } from 'react-redux-toastr';

// services
import { fetchDatasets } from 'services/dataset';

// component
import ExploreNearRealTimeComponent from './component';

const ExploreNearRealTimeContainer = (props) => {
  const [datasets, setDatasets] = useState({
    today: [],
    week: [],
    month: [],
    loading: true
  });

  useEffect(() => {
    fetchDatasets({
      'concepts[0][0]': 'near_real_time',
      'page[size]': 99,
      includes: 'layer,metadata',
      published: true
    })
      .then((data) => {
        const newDatasets = {
          today: [],
          week: [],
          month: [],
          loading: false
        };
        const now = new Date();
        const oneDay = 1000 * 60 * 60 * 24;
        const oneWeek = oneDay * 7;
        const oneMonth = oneDay * 30;

        data.forEach((dataset) => {
          if (dataset.dataLastUpdated) {
            const tempDate = new Date(dataset.dataLastUpdated);
            const difference = now - tempDate;
            if (difference < oneDay) {
              newDatasets.today.push(dataset);
            } else if (difference < oneWeek) {
              newDatasets.week.push(dataset);
            } else if (difference < oneMonth) {
              newDatasets.month.push(dataset);
            }
          }
        });
        setDatasets(newDatasets);
      })
      .catch(error => toastr.error('Error loading Near-Real-Time datasets', error));
  }, []);

  return (
    <ExploreNearRealTimeComponent
      datasets={datasets}
      {...props}
    />);
};

ExploreNearRealTimeContainer.propTypes = { datasetID: PropTypes.string };
ExploreNearRealTimeContainer.defaultProps = { datasetID: null };


export default connect(
  state => ({
    responsive: state.responsive,
    selectedDataset: state.explore.datasets.selected
  }),
  actions
)(ExploreNearRealTimeContainer);
