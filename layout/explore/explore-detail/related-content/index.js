import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import * as actions from 'layout/explore/actions';

// services
import { fetchSimilarDatasets } from 'services/graph';
import { fetchDatasets } from 'services/dataset';

// component
import RelatedContentComponent from './component';

const RelatedContentContainer = (props) => {
  const { datasetID } = props;
  const [datasets, setDatasets] = useState({
    list: [],
    loading: false
  });

  useEffect(() => {
    if (datasetID) {
      setDatasets({ list: [], loading: true });
      fetchSimilarDatasets({
        dataset: datasetID,
        published: true,
        limit: 3
      }).then((data) => {
        if (data.length > 0) {
          fetchDatasets({
            ids: data.map(d => d.dataset).join(','),
            includes: 'widget,metadata,layer,vocabulary'
          })
            .then((similarDatasets) => {
              setDatasets({
                list: similarDatasets,
                loading: false
              });
            });
        }
      })
        .catch(error => toastr.error('Error loading related content', error));
    }
  }, [datasetID]);

  return (<RelatedContentComponent datasets={datasets} {...props} />);
};

RelatedContentContainer.propTypes = { datasetID: PropTypes.string };
RelatedContentContainer.defaultProps = { datasetID: null };

export default connect(null, actions)(RelatedContentContainer);
