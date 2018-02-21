import { createAction, createThunkAction } from 'redux-tools';

// Components
import LayerGlobeManager from 'utils/layers/LayerGlobeManager';

export const resetLayerPoints = createAction('layer-menu-dropdown/resetLayerPoints');
export const setActiveLayer = createAction('layer-menu-dropdown/setActiveLayer');

export const toggleActiveLayer = createThunkAction('layer-menu-dropdown/toggleActiveLayer', ({
  id,
  threedimensional,
  markerType,
  basemap,
  contextLayers,
  descriptionPulse
}) =>
  (dispatch) => {
    if (id) {
      fetch(new Request(`${process.env.WRI_API_URL}/layer/${id}`))
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error(response.statusText);
        })
        .then(async (response) => {
          const layer = response.data;
          layer.threedimensional = threedimensional;
          layer.markerType = markerType;
          layer.basemap = basemap;
          layer.contextLayers = [];
          layer.descriptionPulse = descriptionPulse;

          if (contextLayers.length > 0) {
            let layersLoaded = 0;
            const urlSt = `${process.env.WRI_API_URL}/layer/?ids=${contextLayers.join()}&env=production,preproduction`;
            fetch(new Request(urlSt))
              .then((resp) => {
                return resp.json();
              })
              .then((res) => {
                const layerGlobeManager = new LayerGlobeManager();
                res.data.forEach((l) => {
                  layerGlobeManager.addLayer(
                    { ...l.attributes, id: l.id },
                    {
                      onLayerAddedSuccess: function success(result) {
                        layer.contextLayers.push(result);
                        layersLoaded++;
                        if (contextLayers.length === layersLoaded) {
                          dispatch(setActiveLayer(layer));
                        }
                      }
                    },
                    true
                  );
                });
              });
          } else {
            dispatch(setActiveLayer(layer));
          }
        })
        .catch(() => {
          // Fetch from server ko -> Dispatch error
          dispatch(setActiveLayer(null));
        });
    } else {
      dispatch(setActiveLayer(null));
    }
  });
