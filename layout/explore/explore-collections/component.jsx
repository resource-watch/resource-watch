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

// hooks
import useFetchCollection from 'hooks/collection/fetch-collection';

// Styles
import './styles.scss';

const ExploreCollections = ({
  token,
  selectedDataset,
  selectedCollection,
}) => {
  const [datasets, setDatasets] = useState([]);
  const [datasetsLoading, setDatasetsLoading] = useState(false);
  const {
    data: collection,
    isFetching: collectionIsFetching,
  } = useFetchCollection(selectedCollection, token);

  useEffect(() => {
    if (!collection) return () => {};
    const datasetIDs = collection.resources
      .filter(({ type }) => type === 'dataset')
      .map(({ id }) => id);

    if (datasetIDs.length) {
      setDatasetsLoading(true);
      fetchDatasets({
        ids: datasetIDs.join(','),
        includes: 'widget,metadata,layer,vocabulary',
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
    return () => {};
  }, [collection]);

  return (
    <div className={classnames({
      'c-explore-collections': true,
      '-hidden': selectedDataset,
    })}
    >
      <Spinner
        isLoading={(datasetsLoading || collectionIsFetching)}
        className="-light -relative"
      />
      {datasets.length > 0 && (
        <DatasetList
          list={datasets}
          actions={<ExploreDatasetsActions />}
        />
      )}
    </div>
  );
};

ExploreCollections.defaultProps = {
  selectedDataset: null,
};

ExploreCollections.propTypes = {
  token: PropTypes.string.isRequired,
  selectedDataset: PropTypes.string,
  selectedCollection: PropTypes.string.isRequired,
};

export default ExploreCollections;
