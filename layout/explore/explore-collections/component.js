import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import classnames from 'classnames';

// Services
import { fetchDatasets } from 'services/dataset';

// Components
import DatasetList from 'layout/explore/explore-datasets/list';
import Spinner from 'components/ui/Spinner';
import ExploreDatasetsActions from 'layout/explore/explore-datasets/explore-datasets-actions';

// Styles
import './styles.scss';

function ExploreCollectionsComponent(props) {
  const { collection, selectedDataset } = props;
  const [datasets, setDatasets] = useState([]);
  const [datasetsLoading, setDatasetsLoading] = useState(false);

  useEffect(() => {
    const datasetIDs = (collection &&
        collection.resources.filter(elem => elem.type === 'dataset').map(e => e.id)) || [];
    if (datasetIDs.length > 0) {
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
    <div className={classnames({
        'c-explore-collections': true,
        '-hidden': selectedDataset
      })}
    >
      <Spinner isLoading={datasetsLoading} className="-light -relative" />
      {datasets.length > 0 &&
        <DatasetList
          list={datasets}
          actions={<ExploreDatasetsActions />}
        />
        }
    </div>
  );
}

ExploreCollectionsComponent.propTypes = {
  collection: PropTypes.object.isRequired,
  selectedDataset: PropTypes.string.isRequired
};

export default ExploreCollectionsComponent;
