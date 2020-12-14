import React, {
  useState,
  useEffect,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

// components
import Modal from 'components/modal/modal-component';
import MapMenu from 'layout/app/dashboard-detail/energy-country-explorer/power-generation-map/map-menu';
import LayerInfoModal from 'layout/app/dashboard-detail/energy-country-explorer/power-generation-map/layer-info-modal';
import ExploreMap from 'layout/app/dashboard-detail/energy-country-explorer/power-generation-map/map';

// utils
import { getUserAreaLayer } from 'components/map/utils';

// constants
import {
  USER_AREA_LAYER_TEMPLATES,
} from 'components/map/constants';

// styles
import './styles.scss';

const PowerGenerationMap = ({
  id,
  mapTitle,
  groups,
  bbox,
  geojson,
  setBounds,
  resetExplore,
}) => {
  const [layerModalOpen, setLayerModalOpen] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState(null);

  useEffect(() => {
    setBounds({
      bbox,
      options: { padding: 50 },
    });
  }, [bbox, setBounds]);

  useEffect(() => () => {
    resetExplore();
  }, [resetExplore]);

  const aoiLayer = useMemo(() => (geojson ? getUserAreaLayer(
    {
      id: `${id}-area-of-interest`,
      geojson,
    },
    USER_AREA_LAYER_TEMPLATES.explore,
  ) : null), [geojson]);

  return (
    <div className="c-power-generation-map">
      <div className="header">
        <h4>{mapTitle}</h4>
      </div>
      <div className="main-container">
        <MapMenu
          groups={groups}
        />
        <div className="map-container">
          <ExploreMap
            aoi={aoiLayer}
            exploreDefault={false}
            onLayerInfoButtonClick={(layer) => {
              setSelectedLayer(layer);
              setLayerModalOpen(true);
            }}
          />
        </div>
      </div>
      <Modal
        isOpen={layerModalOpen}
        onRequestClose={() => setLayerModalOpen(false)}
        className="-medium"
      >
        { selectedLayer && <LayerInfoModal layer={selectedLayer} /> }
      </Modal>
    </div>
  );
};

PowerGenerationMap.defaultProps = {
  bbox: null,
  geojson: null,
};

PowerGenerationMap.propTypes = {
  id: PropTypes.string.isRequired,
  mapTitle: PropTypes.string.isRequired,
  groups: PropTypes.arrayOf().isRequired,
  bbox: PropTypes.arrayOf(
    PropTypes.number,
  ),
  geojson: PropTypes.shape(),
  setBounds: PropTypes.func.isRequired,
  resetExplore: PropTypes.func.isRequired,
};

export default PowerGenerationMap;
