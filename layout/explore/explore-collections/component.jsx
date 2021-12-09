import {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

// Components
import DatasetList from 'layout/explore/explore-datasets/list';
import Spinner from 'components/ui/Spinner';
import ExploreDatasetsActions from 'layout/explore/explore-datasets/explore-datasets-actions';

// hooks
import useFetchCollection from 'hooks/collection/fetch-collection';
import useFetchDatasets from 'hooks/dataset/fetch-datasets';

const ExploreCollections = ({
  token,
  selectedCollection,
}) => {
  const {
    data: collection,
    isFetching: collectionIsFetching,
  } = useFetchCollection(
    selectedCollection,
    token,
    {},
    {
      enabled: !!(selectedCollection),
    },
  );

  const datasetIDs = useMemo(() => {
    if (!collection) return [];
    return collection.resources
      .filter(({ type }) => type === 'dataset')
      .map(({ id }) => id);
  }, [collection]);

  const {
    data: datasets,
    isFetching: datasetsIsFetching,
  } = useFetchDatasets(
    {
      ids: datasetIDs.join(','),
      includes: 'widget,metadata,layer,vocabulary',
      env: process.env.NEXT_PUBLIC_ENVS_SHOW,
    },
    {
      enabled: datasetIDs.length > 0,
      initialData: [],
      initialStale: true,
    },
  );

  return (
    <div className="c-explore-collections">
      {(datasetsIsFetching || collectionIsFetching) && (
        <Spinner
          isLoading
          className="-light"
        />
      )}
      {datasets.length > 0 && (
        <DatasetList
          list={datasets}
          actions={<ExploreDatasetsActions />}
        />
      )}
    </div>
  );
};

ExploreCollections.propTypes = {
  token: PropTypes.string.isRequired,
  selectedCollection: PropTypes.string.isRequired,
};

export default ExploreCollections;
