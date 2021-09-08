import {
  useReducer,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';

import {
  isStagingAPI,
} from 'utils/api';

// components
import WidgetSidebar from './widget-sidebar';
import MiniExploreMap from './map';

// reducers
import {
  miniExploreWidgetState,
  miniExploreWidgetSlice,
} from './reducer';

// styles
import './styles.scss';

const miniExploreWidgetReducer = miniExploreWidgetSlice.reducer;
const {
  setGeostore,
} = miniExploreWidgetSlice.actions;
const isStaging = isStagingAPI();
let clickState = null;
export default function MiniExploreWidgets({
  config: {
    title,
    layers,
    mask,
    widgets,
    areaOfInterest,
  },
  params,
  adapter,
}) {
  const [state, dispatch] = useReducer(miniExploreWidgetReducer, miniExploreWidgetState);

  const onClickLayer = useCallback(({ features }, map) => {
    if (clickState) {
      map.setFeatureState(
        clickState,
        {
          active: false,
        },
      );
    }

    if (!features.length) return false;

    const dataFeature = features.find(({ id }) => Boolean(id));

    if (!dataFeature) return false;
    const {
      source,
      sourceLayer,
      properties,
    } = dataFeature;

    const geostore = properties[`${isStaging ? 'geostore_staging' : 'geostore_prod'}`];

    clickState = {
      source,
      sourceLayer,
      id: properties.cartodb_id,
    };

    map.setFeatureState(
      clickState,
      {
        active: true,
      },
    );

    return dispatch(setGeostore(geostore));
  }, []);

  return (
    <div className="c-mini-explore-widgets">
      <header>
        <h4>
          {title}
        </h4>
      </header>
      <div className="main-container">
        <MiniExploreMap
          layerIds={layers}
          mask={mask}
          areaOfInterest={areaOfInterest}
          onClickLayer={onClickLayer}
          params={params}
        />
        <WidgetSidebar
          adapter={adapter}
          widgetIds={widgets}
          params={{
            ...params,
            ...state.geostore && { geostore_id: state.geostore },
          }}
        />
      </div>
    </div>
  );
}

MiniExploreWidgets.defaultProps = {
  params: {},
};

MiniExploreWidgets.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string.isRequired,
    layers: PropTypes.arrayOf(
      PropTypes.string.isRequired,
    ).isRequired,
    mask: PropTypes.shape({}),
    widgets: PropTypes.arrayOf(
      PropTypes.string.isRequired,
    ).isRequired,
    areaOfInterest: PropTypes.string,
  }).isRequired,
  params: PropTypes.shape({}),
  adapter: PropTypes.func.isRequired,
};
