import {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

// components
import Icon from 'components/ui/icon';
import Spinner from 'components/ui/Spinner';
import DatasetList from 'layout/explore/explore-datasets/list';
import ExploreDatasetsActions from 'layout/explore/explore-datasets/explore-datasets-actions';
import CardPlaceholder from 'components/card-placeholder';

// hooks
import useFetchUserFavorites from 'hooks/favorite/fetch-favorites';
import useFetchDatasets from 'hooks/dataset/fetch-datasets';

const ExploreFavorites = ({
  userToken,
}) => {
  const {
    data: favorites,
  } = useFetchUserFavorites([userToken], {
    initialData: [],
    initialStale: true,
  });
  const favoriteDatasets = useMemo(() => favorites.filter(({ resourceType }) => resourceType === 'dataset'), [favorites]);
  const datasetIds = useMemo(
    () => favoriteDatasets.map(({ resourceId }) => resourceId),
    [favoriteDatasets],
  );
  const {
    data: datasets,
    isFetchedAfterMount,
  } = useFetchDatasets({
    ids: datasetIds.join(','),
    includes: 'widget,metadata,layer,vocabulary',
    env: process.env.NEXT_PUBLIC_ENVS_SHOW,
  },
  {
    enabled: !!(datasetIds.length),
    initialData: [],
    initialStale: true,
    keepPreviousData: true,
  });

  return (
    <div className="c-explore-favorites">
      {(!isFetchedAfterMount && !datasets.length) && (
        <Spinner
          isLoading
          className="-light"
        />
      )}
      <DatasetList
        list={datasets}
        actions={<ExploreDatasetsActions />}
      />
      {(isFetchedAfterMount && !datasets.length) && (
        <div className="no-datasets">
          <CardPlaceholder />
          <div className="message">
            <h5>You currently have no favorite datasets</h5>
            <p>
              To favorite a dataset or start a collection, click the
              &nbsp;
              <Icon
                name="icon-star-full"
                className="-star -small"
              />
              &nbsp;
              on any dataset card.
            </p>
          </div>
          <CardPlaceholder />
          <CardPlaceholder />
        </div>
      )}
    </div>
  );
};

ExploreFavorites.propTypes = {
  userToken: PropTypes.string.isRequired,
};

export default ExploreFavorites;
