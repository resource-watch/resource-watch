import PropTypes from 'prop-types';

import {
  isStagingAPI,
} from 'utils/api';

// components
import WidgetSidebar from './widget-sidebar';
import MiniExploreMap from './map';

// styles
import './styles.scss';

const isStaging = isStagingAPI();

export default function MiniExploreWidgets({
  config: {
    title,
    layers,
    mask,
    widgets,
    areaOfInterest,
  },
  adapter,
  widgetParams,
}) {
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
          params={{
            geostore_env: isStaging ? 'geostore_staging' : 'geostore_prod',
            ...areaOfInterest && { geostore_id: areaOfInterest },
          }}
        />
        <WidgetSidebar
          adapter={adapter}
          widgetIds={widgets}
          params={widgetParams}
          areaOfInterest={areaOfInterest}
        />
      </div>
    </div>
  );
}

MiniExploreWidgets.defaultProps = {
  widgetParams: {},
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
  widgetParams: PropTypes.shape({}),
  adapter: PropTypes.func.isRequired,
};
