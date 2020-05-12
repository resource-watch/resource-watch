import React from 'react';
import PropTypes from 'prop-types';

// Components
import MapMenu from './map-menu';
import Map from 'components/map';
import LayerManager from 'components/map/layer-manager';
import MapControls from 'components/map/controls';
import ZoomControls from 'components/map/controls/zoom';
import LayerPopup from 'components/map/popup';

// Styles
import './styles.scss';

function PowerGenerationMap(props) {
  const { selectedCountry, mapTitle, groups } = props;

  return (
    <div className="c-power-generation-map">
      <div className="header">
        <h4>{mapTitle}</h4>
      </div>
      <div className="main-container">
        <MapMenu
          groups={groups}
        />
      </div>
      {/* <div className="c-map">
                <Map
                    mapboxApiAccessToken={process.env.RW_MAPBOX_API_TOKEN}
                    onClick={() => {}}
                    mapStyle={MAPSTYLES}
                    basemap={BASEMAPS.dark.value}
                    labels={LABELS.light.value}
                    viewport={viewport}
                    onViewportChange={() => {}}
                    scrollZoom={false}
                    boundaries
                >
                    {_map => (
                        <Fragment>
                            <LayerManager
                                map={_map}
                                layers={layers}
                            />

                            {shouldRenderPopup &&
                                <Popup
                                    {...interactionLatLng}
                                    closeButton
                                    closeOnClick={false}
                                    onClose={() => {}}
                                    className="rw-popup-layer"
                                    maxWidth="250px"
                                >
                                    <LayerPopup
                                        data={layerPopupData}
                                        latlng={layerPopupLatlng}
                                        onChangeInteractiveLayer={setLayerInteractionSelected}
                                    />
                                </Popup>
                            }
                        </Fragment>
                    )}
                </Map>
            </div>

            <MapControls>
                <ZoomControls
                    viewport={viewport}
                    onClick={() => {}}
                />
            </MapControls>

            <div className="c-legend-map">
                <Legend
                    maxHeight={140}
                    sortable={false}
                >
                    {layerGroups.map((lg, i) => (
                        <LegendListItem
                            index={i}
                            key={lg.dataset}
                            layerGroup={lg}
                        >
                            <LegendItemTypes />
                        </LegendListItem>
                    ))}
                </Legend>
            </div> */}
    </div>
  );
}

PowerGenerationMap.propTypes = {
  selectedCountry: PropTypes.string.isRequired,
  mapTitle: PropTypes.string.isRequired,
  groups: PropTypes.array.isRequired
};

export default PowerGenerationMap;
