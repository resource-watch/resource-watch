import {
  useMemo,
} from 'react';

// hooks
import {
  useMe,
} from 'hooks/user';
import {
  useFetchDatasets,
} from 'hooks/dataset/fetch-datasets';

// components
import DatasetList from 'layout/explore/explore-datasets/list';
import Spinner from 'components/ui/Spinner';
import ExploreDatasetsActions from 'layout/explore/explore-datasets/explore-datasets-actions';
import MyDataComingSoon from './coming-soon';

// styles
import './styles.scss';

const VALID_DATASET_PROVIDERS = [
  'cartodb',
  'gee',
];

export default function ExploreMyData() {
  const {
    data: user,
  } = useMe();

  const {
    data: datasets,
    isFetching,
  } = useFetchDatasets({
    userId: user?.id,
    application: process.env.NEXT_PUBLIC_APPLICATIONS,
    includes: 'layer,metadata',
    env: process.env.NEXT_PUBLIC_ENVS_SHOW,
  }, {
    enabled: !!user?.id,
    refetchOnWindowFocus: false,
    initialData: [],
    initialStale: true,
  });

  // only datasets with, at least, one layer and CARTO/GEE provider will be displayed
  const datasetsToDisplay = useMemo(() => datasets
    .filter(({
      layer,
      provider,
    }) => (layer.length > 0 && VALID_DATASET_PROVIDERS.includes(provider))),
  [datasets]);

  return (
    <div className="c-explore-my-data">
      {(isFetching && user?.id) && <Spinner className="-light" isLoading />}

      {(!isFetching && datasetsToDisplay.length > 0) && (
        <DatasetList
          list={datasetsToDisplay}
          actions={<ExploreDatasetsActions />}
        />
      )}

      {((!isFetching && !datasetsToDisplay.length) || !user?.id) && (
        <MyDataComingSoon />
      )}
    </div>
  );
}
