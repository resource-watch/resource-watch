import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// Services
import { fetchDatasets } from 'services/dataset';

// Components
import DatasetList from 'layout/explore/explore-datasets/list';
import Spinner from 'components/ui/Spinner';

// Styles
import './styles.scss';

function ExploreCollectionsComponent(props) {
  const { collection } = props;
  const [datasets, setDatasets] = useState([]);
  const [datasetsLoading, setDatasetsLoading] = useState(false);

  useEffect(() => {
    const datasetIDs = collection &&
        collection.resources.filter(elem => elem.type === 'dataset').map(e => e.id) || [];
    if (datasetIDs.length > 0) {
      console.log('load datasets:', datasetIDs);

      setDatasetsLoading(true);
      fetchDatasets({
        ids: datasetIDs.join(','),
        includes: 'widget,metadata,layer,vocabulary'
      })
        .then((data) => {
          setDatasets(data);
          setDatasetsLoading(false);
        })
        .catch((err) => {
          toastr.error('Error loading collection datasets', err);
          setDatasetsLoading(false);
        });
    } else {
      setDatasets([]);
    }
  }, [collection]);

  return (
    <div className="c-explore-collections">
      <Spinner isLoading={datasetsLoading} className="-light" />
      {datasets.length > 0 &&
        <DatasetList list={datasets} />
            }
    </div>
  );
}

ExploreCollectionsComponent.propTypes = {
  setFiltersSelected: PropTypes.func.isRequired,
  setDatasetsPage: PropTypes.func.isRequired,
  fetchDatasets: PropTypes.func.isRequired
};

export default ExploreCollectionsComponent;
