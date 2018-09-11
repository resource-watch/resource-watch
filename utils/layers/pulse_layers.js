import React from 'react';

// Components
import LayerPill from 'layout/pulse/layer-pill';
import LabelsPill from 'layout/pulse/labels-pill';

// Util
import { LABELS } from 'components/ui/map/constants';

export const LAYERS_PLANET_PULSE = [
  {
    label: 'Land',
    layers: [
      {
        label: 'Crop and vegetation health',
        id: 'e9f9d20c-1924-48b2-97ed-6936e233adb2',
        '3d': false,
        descriptionPulse:
          <div className="description">
            <div className="description-text">
        The vegetation health index (VHI) is an indicator of water and heat stress on crops and natural vegetation. Values below 40 may indicate reduced crop yields or greater fire risk. VHI is derived from data from the VIIRS sensor on the Suomi NPP satellite.
            </div>
            <div className="view-with-container">
              <span className="view-with-label"><strong>View with:</strong></span>
              <LayerPill layerId="c7e76588-6da5-4645-8842-2d2ac0001110" label="Cropland" />
              <LabelsPill url={LABELS.light.value} label="Labels" />
            </div>
          </div>,
        initialPosition: { latitude: 0, longitude: 0, height: 20000000 },
        contextLayers: ['c7e76588-6da5-4645-8842-2d2ac0001110'],
        contextLayersOnTop: true,
        widgets: [],
        basemap: {
          name: 'other',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cjhqiecof53wv2rl9gw4cehmy/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Forest clearing',
        id: 'f4897107-5ae5-4685-8eee-cd1a5745a384',
        '3d': false,
        descriptionPulse:
          <div className="description">
            <div className="description-text">
              Trees are cut for timber or cleared for agriculture, mining and development. FORMA Active Clearing Alerts detect likely tree cover loss across the tropics using data from the MODIS sensors aboard NASA’s Terra and Aqua satellites.
            </div>
            <div className="view-with-container">
              <span className="view-with-label"><strong>View with:</strong></span>
              <LayerPill layerId="7a270c3a-1161-4fb2-a613-090d3e603126" label="Forests" />
              <LayerPill layerId="ed051817-1cb3-42cc-91b5-1caaea6f8ca6" label="Forest loss" />
              <LayerPill layerId="bd9ec0da-84a0-4429-bf30-ffcbe64fbe7b" label="Data coverage" />
              <LabelsPill url={LABELS.light.value} label="Labels" />
            </div>
          </div>,
        initialPosition: { latitude: -13.2399454992863, longitude: -52.734375, height: 20000000 },
        contextLayers: [
          'bd9ec0da-84a0-4429-bf30-ffcbe64fbe7b',
          '7a270c3a-1161-4fb2-a613-090d3e603126',
          'ed051817-1cb3-42cc-91b5-1caaea6f8ca6'
        ],
        contextLayersOnTop: false,
        widgets: [],
        basemap: {
          name: 'other',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cjhqiecof53wv2rl9gw4cehmy/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Satellite imagery',
        id: '275dcc83-673b-44e4-b7db-253ff1d2d867',
        '3d': false,
        descriptionPulse:
          <div className="description">
            <div className="description-text">
              The VIIRS sensor aboard the Suomi NPP satellite collects imagery as it orbits the Earth every 100 minutes. Passing over the poles 14 times per day, it crosses the equator at at 1:30am local time, photographing the entire world each day.
            </div>
            <div className="view-with-container">
              <span className="view-with-label"><strong>View with:</strong></span>
              <LabelsPill url={LABELS.dark.value} label="Labels" />
            </div>
          </div>,
        initialPosition: { latitude: 0, longitude: 0, height: 20000000 },
        contextLayers: [],
        contextLayersOnTop: true,
        widgets: [],
        basemap: {
          name: 'other',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cjhqiecof53wv2rl9gw4cehmy/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Nighttime imagery',
        id: '91642712-916c-4b03-9d3c-1924a998ea98',
        '3d': false,
        descriptionPulse:
          <div className="description">
            <div className="description-text">
              The VIIRS sensor aboard the Suomi NPP satellite collects nighttime imagery as it orbits the Earth every 100 minutes. Passing over the poles 14 times per day, it crosses the equator at on the nighttime side of the Earth at 1:30am local time.
            </div>
            <div className="view-with-container">
              <span className="view-with-label"><strong>View with:</strong></span>
              <LabelsPill url={LABELS.light.value} label="Labels" />
            </div>
          </div>,
        initialPosition: { latitude: 0, longitude: 0, height: 20000000 },
        contextLayers: [],
        contextLayersOnTop: true,
        widgets: [],
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      }
    ]
  },
  {
    label: 'Water',
    layers: [
      {
        label: 'Floods',
        id: '80d2665b-bba4-4de9-ba5e-d0487e920784',
        '3d': false,
        descriptionPulse:
          <div className="description">
            <div className="description-text">
              Major floods can devastate affected areas, displacing people and disrupting the local economy. The Dartmouth Flood Observatory aggregates flood reports from news, governmental, instrumental, and remote sensing sources.
            </div>
            <div className="view-with-container">
              <span className="view-with-label"><strong>View with:</strong></span>
              <LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="Population" />
              <LabelsPill url={LABELS.light.value} label="Labels" />
            </div>
          </div>,
        initialPosition: { latitude: 0, longitude: 0, height: 20000000 },
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        contextLayersOnTop: false,
        widgets: [],
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Droughts',
        id: '4d52872e-0653-4b28-a1a6-dd4edbb76dd3',
        contextLayers: ['c7e76588-6da5-4645-8842-2d2ac0001110'],
        contextLayersOnTop: true,
        '3d': false,
        widgets: [],
        descriptionPulse:
          <div className="description">
            <div className="description-text">
              The 6-month Standardized Precipitation-Evapotranspiration Index (SPEI) is an indicator of short-term drought affecting rainfed crops and vegetation. SPEI is calculated by comparing the past six months’ rainfall and evaporation rate to a historical baseline (1950-2010).
            </div>
            <div className="view-with-container">
              <span className="view-with-label"><strong>View with:</strong></span>
              <LayerPill layerId="c7e76588-6da5-4645-8842-2d2ac0001110" label="Cropland" />
              <LabelsPill url={LABELS.light.value} label="Labels" />
            </div>
          </div>,
        initialPosition: { latitude: 0, longitude: 0, height: 20000000 },
        basemap: {
          name: 'other',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cjhqiecof53wv2rl9gw4cehmy/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      }
    ]
  },
  {
    label: 'Air quality',
    layers: [
      {
        label: 'Particulate matter (PM 10)',
        id: '73cc7325-a62c-4a8d-9724-af697d3f7072',
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        contextLayersOnTop: false,
        '3d': false,
        descriptionPulse:
          <div className="description">
            <div className="description-text">
              Dust particles less than 10 microns in diameter from road dust, industrial pollution and other sources affect human health. These air quality measurements are collected from government and research sources by OpenAQ.
            </div>
            <div className="view-with-container">
              <span className="view-with-label"><strong>View with:</strong></span>
              <LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="Population" />
              <LabelsPill url={LABELS.light.value} label="Labels" />
            </div>
          </div>,
        initialPosition: { latitude: 0, longitude: 0, height: 20000000 },
        widgets: [],
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Fine particulate matter (PM 2.5)',
        id: 'a5136895-9aab-4f2c-8a33-d22b833724ec',
        descriptionPulse:
          <div className="description">
            <div className="description-text">
              Fine particles less than 2.5 microns in diameter are known to have more severe health impacts than their larger cousins. Air quality measurements are collected from government and research sources by OpenAQ.
            </div>
            <div className="view-with-container">
              <span className="view-with-label"><strong>View with:</strong></span>
              <LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="Population" />
              <LabelsPill url={LABELS.light.value} label="Labels" />
            </div>
          </div>,
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        initialPosition: { latitude: 0, longitude: 0, height: 20000000 },
        contextLayersOnTop: false,
        '3d': false,
        widgets: [],
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
          },
        {
        label: 'Air Quality Measurements (SO₂)',
        id: '509c71b2-9c68-4acd-88a6-f64015494001',
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        contextLayersOnTop: false,
        '3d': false,
        descriptionPulse:
          <div className="description">
            <div className="description-text">
              Sufur dioxide (SO₂) is released into the air from the burning of fossil fuels.  It contributes to particulate matter concentrations and can cause acid rain.  These air quality measurements are collected from government and research sources by OpenAQ.
            </div>
            <div className="view-with-container">
              <span className="view-with-label"><strong>View with:</strong></span>
              <LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="Population" />
              <LabelsPill url={LABELS.light.value} label="Labels" />
            </div>
          </div>,
        initialPosition: { latitude: 0, longitude: 0, height: 20000000 },
        widgets: [],
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
        {
        label: 'Air Quality Measurements (NO₂)',
        id: '99f02e72-c59d-4d3d-880f-922bff7b7f39',
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        contextLayersOnTop: false,
        '3d': false,
        descriptionPulse:
          <div className="description">
            <div className="description-text">
              Nitrogen dioxide (NO₂) is released into the atmosphere from the burning of fossil fuels.  Breathing air with high concentrations of NO₂ can result in respiratory symptoms.  These air quality measurements are collected from government and research sources by OpenAQ.
            </div>
            <div className="view-with-container">
              <span className="view-with-label"><strong>View with:</strong></span>
              <LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="Population" />
              <LabelsPill url={LABELS.light.value} label="Labels" />
            </div>
          </div>,
        initialPosition: { latitude: 0, longitude: 0, height: 20000000 },
        widgets: [],
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
        {
        label: 'Air Quality Measurements (Tropospheric/Ground-level O3)',
        id: '39524ca8-e1e3-4e9f-8b77-6682064bd176',
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        contextLayersOnTop: false,
        '3d': false,
        descriptionPulse:
          <div className="description">
            <div className="description-text">
              Unlike stratospheric ozone that protects from ultraviolet rays, ground-level, or tropospheric ozone (O3) is created through the interactions of the emissions of volatile organic compounds (from gasoline burning engines) and nitrogen oxides (from the burning of fossil fuels) in the presence of heat and sunlight. These air quality measurements are collected from government and research sources by OpenAQ.
            </div>
            <div className="view-with-container">
              <span className="view-with-label"><strong>View with:</strong></span>
              <LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="Population" />
              <LabelsPill url={LABELS.light.value} label="Labels" />
            </div>
          </div>,
        initialPosition: { latitude: 0, longitude: 0, height: 20000000 },
        widgets: [],
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
        {
        label: 'Air Quality Measurements (CO)',
        id: '8f73075e-80b8-4176-86f2-88c0c4af129c',
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        contextLayersOnTop: false,
        '3d': false,
        descriptionPulse:
          <div className="description">
            <div className="description-text">
              Carbon monoxide (CO) is a colorless, odorless gas released into the atmosphere when burning materials.  It can be harmful to human health if inhaled in high concentrations.  These air quality measurements are collected from government and research sources by OpenAQ.
            </div>
            <div className="view-with-container">
              <span className="view-with-label"><strong>View with:</strong></span>
              <LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="Population" />
              <LabelsPill url={LABELS.light.value} label="Labels" />
            </div>
          </div>,
        initialPosition: { latitude: 0, longitude: 0, height: 20000000 },
        widgets: [],
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
         {
        label: 'Air Quality Measurements (BC)',
        id: 'd40902f3-4948-48b0-a847-675d40222a55',
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        contextLayersOnTop: false,
        '3d': false,
        descriptionPulse:
          <div className="description">
            <div className="description-text">
              High black carbon (BC) concentrations have negative implications for both human health and the climate, and are caused by the burning of fossil fuels. These air quality measurements are collected from government and research sources by OpenAQ.
            </div>
            <div className="view-with-container">
              <span className="view-with-label"><strong>View with:</strong></span>
              <LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="Population" />
              <LabelsPill url={LABELS.light.value} label="Labels" />
            </div>
          </div>,
        initialPosition: { latitude: 0, longitude: 0, height: 20000000 },
        widgets: [],
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
    ]
  },
  {
    label: 'Climate',
    layers: [
      {
        label: 'Arctic sea ice',
        id: 'b92c01ee-eb2c-4835-8625-d138db75a1cd',
        contextLayers: [],
        contextLayersOnTop: true,
        rotatableGlobe: true,
        initialPosition: { latitude: 80.4157074446218, longitude: -38.67187499999999, height: 20000000 },
        '3d': false,
        widgets: [],
        descriptionPulse:
          <div className="description">
            <div className="description-text">
              Sea ice grows and shrinks with temperature, affecting global weather patterns and shipping routes. Sea ice extent typically peaks in March and reaches its lowest point in September in the Northern Hemisphere. Extents are measured the National Oceanic and Atmospheric Administration (NOAA) using data from the Defense Meteorological Satellite Program satellites.
            </div>
            <div className="view-with-container">
              <span className="view-with-label"><strong>View with:</strong></span>
              <LayerPill layerId="d87bb471-1ac0-4f79-818a-e270f04185bf" label="Historical extent" />
              <LabelsPill url={LABELS.light.value} label="Labels" />
            </div>
          </div>,
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Coral reef bleaching',
        id: '31429259-9a9a-4d66-a1b9-92c08aa407f3',
        '3d': false,
        descriptionPulse:
          <div className="description">
            <div className="description-text">
              Abnormally high ocean temperatures can damage coral reefs, turning them a bleached white. The National Oceanic and Atmospheric Administration (NOAA) generates bleaching alerts from sea surface temperature data derived from a combination of global weather satellites.
            </div>
            <div className="view-with-container">
              <span className="view-with-label"><strong>View with:</strong></span>
              <LayerPill layerId="c04b8f05-18d5-44cd-8cad-e5a171fe3034" label="Reef locations" />
              <LabelsPill url={LABELS.light.value} label="Labels" />
            </div>
          </div>,
        contextLayers: ["c04b8f05-18d5-44cd-8cad-e5a171fe3034"],
        contextLayersOnTop: true,
        initialPosition: { latitude: -164.00390625, longitude: -8.233237111274553, height: 20000000 },
        widgets: [],
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      }
    ]
  },
  {
    label: 'Humanitarian',
    layers: [
      {
        label: 'Food insecurity',
        id: 'a2eccfd8-de7e-4fb8-93c4-22f119994f3e',
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        contextLayersOnTop: true,
        '3d': false,
        descriptionPulse:
          <div className="description">
            <div className="description-text">
              Crop failure, conflict, and market failures can limit people’s ability to access enough food to survive. FEWS NET monitors conditions that could lead to severe food insecurity through a combination of on-the-ground reports, satellite data, and expert knowledge of economic conditions. The data are for select countries only.
            </div>
            <div className="view-with-container">
              <span className="view-with-label"><strong>View with:</strong></span>
              <LabelsPill url={LABELS.light.value} label="Labels" />
            </div>
          </div>,
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        },
        initialPosition: { latitude: 0, longitude: 0, height: 20000000 }
      },
      {
        label: 'Conflicts and protests',
        id: '2da3bbb8-a8b7-47b7-b3bc-823ddc330960',
        descriptionPulse:
          <div className="description">
            <div className="description-text">
              The Armed Conflict Location and Event Data Project (ACLED) gathers and reports dates and locations of violence and protests in Africa and 10 countries in South and Southeast Asia. Larger point sizes indicate events with fatalities. The data are for select countries only.
            </div>
            <div className="view-with-container">
              <span className="view-with-label"><strong>View with:</strong></span>
              <LayerPill layerId="117ef67f-0613-40de-8429-a0097fe4f262" label="Data coverage" />
              <LabelsPill url={LABELS.light.value} label="Labels" />
            </div>
          </div>,
        contextLayers: ['117ef67f-0613-40de-8429-a0097fe4f262'],
        contextLayersOnTop: false,
        '3d': false,
        markerType: 'default',
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        },
        initialPosition: { latitude: 0, longitude: 0, height: 20000000 }
      },
      {
        label: 'Migrant Deaths',
        id: '0c094e37-4563-4633-9a38-28dd4a4724bf',
        descriptionPulse:
          <div className="description">
            <div className="description-text">
              Migrants seek to cross international borders to flee hardship or find a better life. The International Organization for Migration (IOM) records deaths of migrants who die during their journies in accidents, shipwrecks, violent attacks, or from medical complications.
            </div>
            <div className="view-with-container">
              <span className="view-with-label"><strong>View with:</strong></span>
              <LabelsPill url={LABELS.light.value} label="Labels" />
            </div>
          </div>,
        contextLayers: [],
        contextLayersOnTop: false,
        '3d': false,
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        },
        initialPosition: { latitude: 0, longitude: 0, height: 20000000 }
      },
      {
        label: 'Asylum requests',
        id: 'd0ec0531-9241-407c-bbae-d3dc55c7d6ea',
        descriptionPulse:
          <div className="description">
            <div className="description-text">
              People who wish to be resettled in another country can apply for refugee status with a specific destination country. 38 European and 6 non-European countries report the number of asylum requests they receive each month to the UN High Commission on Refugees.
            </div>
            <div className="view-with-container">
              <span className="view-with-label"><strong>View with:</strong></span>
              <LayerPill layerId="af3513d5-284f-488c-8256-e90c30a1ca8b" label="Reporting countries" />
              <LabelsPill url={LABELS.light.value} label="Labels" />
            </div>
          </div>,
        contextLayers: ['af3513d5-284f-488c-8256-e90c30a1ca8b'],
        contextLayersOnTop: true,
        '3d': false,
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        },
        initialPosition: { latitude: 0, longitude: 0, height: 20000000 }
      }
    ]
  },
  {
    label: 'Hazards',
    layers: [
      {
        label: 'Fires',
        id: '5ca12eec-f8fe-49eb-b353-67c9eeb5bc6a',
        '3d': false,
        descriptionPulse:
          <div className="description">
            <div className="description-text">
          Fires may occur naturally or be set by people, often to clear land or by accident. Smoke from fires can be a major health hazard. NASA detects fires using the VIIRS sensor on the Suomi NPP satellite.
            </div>
            <div className="view-with-container">
              <span className="view-with-label"><strong>View with:</strong></span>
              <LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="Population" />
              <LayerPill layerId="7a270c3a-1161-4fb2-a613-090d3e603126" label="Forests" />
              <LabelsPill url={LABELS.light.value} label="Labels" />
            </div>
          </div>,
        contextLayers: [
          '7a270c3a-1161-4fb2-a613-090d3e603126',
          '84229e01-4e61-4c08-a7dd-efb7259dd85d'
        ],
        contextLayersOnTop: false,
        widgets: [],
        initialPosition: { latitude: 0, longitude: 0, height: 20000000 },
        basemap: {
          name: 'other',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cjhqiecof53wv2rl9gw4cehmy/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Landslide warnings',
        id: '61067a0d-b2a3-441e-85c1-2eef5a18e4a5',
        '3d': false,
        descriptionPulse:
          <div className="description">
            <div className="description-text">
              Landslides often occur when heavy rains destabilize hillsides. The National Aeronautics and Space Administration (NASA) publishes real-time landslide hazard alerts based on recent precipitation, combined with information on roads, tree cover loss, slope steepness, and bedrock structure.            </div>
            <div className="view-with-container">
              <span className="view-with-label"><strong>View with:</strong></span>
              <LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="Population" />
              <LabelsPill url={LABELS.light.value} label="Labels" />
            </div>
          </div>,
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        contextLayersOnTop: false,
        widgets: [],
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        },
        initialPosition: { latitude: 0, longitude: 0, height: 20000000 }
      },
      {
        label: 'Earthquakes',
        id: 'd63fff22-8cda-467e-b4ef-df3ab2613505',
        contextLayers: [
          '47a1b1d7-e5ad-4b79-9f52-bc9435c6ca06',
          '84229e01-4e61-4c08-a7dd-efb7259dd85d'
        ],
        contextLayersOnTop: false,
        '3d': false,
        markerType: 'bar',
        widgets: [],
        descriptionPulse:
          <div className="description">
            <div className="description-text">
              Earthquakes occur when the Earth’s crust shifts and releases energy in the form of massive vibrations. The U.S. Geological Survey (USGS) monitors earthquakes globally though a network of ground sensors. Larger point sizes indicate larger Earthquakes.
            </div>
            <div className="view-with-container">
              <span className="view-with-label"><strong>View with:</strong></span>
              <LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="Population" />
              <LayerPill layerId="47a1b1d7-e5ad-4b79-9f52-bc9435c6ca06" label="Fault lines" />
              <LabelsPill url={LABELS.light.value} label="Labels" />
            </div>
          </div>,
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        },
        initialPosition: { latitude: 0, longitude: 0, height: 20000000 }
      },
      {
        label: 'Volcanoes',
        id: 'a64f5142-e8ae-433f-afda-6628fc3255bf',
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        contextLayersOnTop: false,
        '3d': true,
        markerType: 'volcano',
        descriptionPulse:
          <div className="description">
            <div className="description-text">
              The Smithsonian Institution (SI) and U.S. Geological Survey (USGS) aggregate reports of volcanic ash cloud releases and new and significant changes in volcanic activity.
            </div>
            <div className="view-with-container">
              <span className="view-with-label"><strong>View with:</strong></span>
              <LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="Population" />
              <LabelsPill url={LABELS.light.value} label="Labels" />
            </div>
          </div>,
        initialPosition: { latitude: -239.0625, longitude: 16.29905101458183, height: 20000000 },
        basemap: {
          name: 'other',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cjhqiecof53wv2rl9gw4cehmy/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      }
    ]
  }
];
