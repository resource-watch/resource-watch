import {
  useReducer,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

// components
import DatasetsSidebar from './datasets-sidebar';
import MiniExploreMap from './map';

// reducers
import {
  miniExploreState,
  miniExploreSlice,
} from './reducer';

// styles
import './styles.scss';

const miniExploreReducer = miniExploreSlice.reducer;

export default function MiniExplore({
  config: {
    title,
    datasetGroups,
    areaOfInterest,
    aoiBorder,
    forcedBbox,
  },
}) {
  const [mapState, dispatch] = useReducer(miniExploreReducer, miniExploreState);
  const {
    layerGroups,
  } = mapState;
  const activeDatasets = useMemo(() => layerGroups.map(({ dataset }) => dataset), [layerGroups]);

  return (
    <div className="c-mini-explore">
      <header>
        <h4>
          {title}
        </h4>
      </header>
      <div className="main-container">
        <DatasetsSidebar
          dispatch={dispatch}
          datasetGroups={datasetGroups}
          activeDatasets={activeDatasets}
        />
        <MiniExploreMap
          dispatch={dispatch}
          mapState={mapState}
          datasetGroups={datasetGroups}
          areaOfInterest={areaOfInterest}
          aoiBorder={aoiBorder}
          forcedBbox={forcedBbox}
        />
      </div>
    </div>
  );
}

MiniExplore.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string.isRequired,
    datasetGroups: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        datasets: PropTypes.arrayOf(PropTypes.string).isRequired,
        default: PropTypes.arrayOf(PropTypes.string),
      }),
    ).isRequired,
    areaOfInterest: PropTypes.string,
    aoiBorder: PropTypes.bool,
    forcedBbox: PropTypes.arrayOf(
      PropTypes.number,
    ),
  }).isRequired,
};
