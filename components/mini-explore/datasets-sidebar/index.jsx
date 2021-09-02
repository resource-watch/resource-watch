import {
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';

// hooks
import useFetchDatasets from 'hooks/dataset/fetch-datasets';

// components
import DatasetsSidebar from './component';

// reducers
import {
  miniExploreSlice,
} from '../reducer';

const {
  toggleMapLayerGroup,
  resetMapLayerGroupsInteraction,
} = miniExploreSlice.actions;

export default function DatasetsSidebarContainer({
  datasetGroups,
  activeDatasets,
  dispatch,
}) {
  const datasetsMap = new Map();
  const datasetIDs = useMemo(
    () => datasetGroups.reduce((acc, group) => [...acc, ...group.datasets], []), [datasetGroups],
  );

  const handleAddMap = useCallback((dataset, layer) => {
    if (!layer) return null;

    dispatch(toggleMapLayerGroup({
      dataset,
      toggle: !dataset.active,
    }));

    if (!dataset.active) dispatch(resetMapLayerGroupsInteraction());

    return true;
  }, [dispatch]);

  const {
    data: datasets,
  } = useFetchDatasets({
    includes: 'layer,metadata',
    ids: datasetIDs.join(','),
    'page[size]': 50,
    env: process.env.NEXT_PUBLIC_ENVS_SHOW,
  }, {
    enabled: !!datasetIDs.length,
    placeholderData: [],
    refetchOnWindowFocus: false,
  });

  const data = useMemo(
    () => {
      datasets.forEach((dataset) => {
        datasetsMap.set(dataset.id, {
          ...dataset,
          active: activeDatasets.includes(dataset.id),
          hrefLink: {
            pathname: '/data/explore/[[...dataset]]',
            query: {
              dataset: [dataset.slug],
            },
          },
        });
      });

      return datasetGroups
        .map((group) => ({
          id: group.title,
          title: group.title,
          datasets: datasets.length ? group.datasets
            .map((datasetId) => datasetsMap.get(datasetId)) : [],
        }));
    },
    [datasets, activeDatasets, datasetsMap, datasetGroups],
  );

  return (
    <DatasetsSidebar
      datasetGroups={data}
      handleAddMap={handleAddMap}
    />
  );
}

DatasetsSidebarContainer.propTypes = {
  datasetGroups: PropTypes.arrayOf(
    PropTypes.shape({
      datasets: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  ).isRequired,
  activeDatasets: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
  dispatch: PropTypes.func.isRequired,
};
