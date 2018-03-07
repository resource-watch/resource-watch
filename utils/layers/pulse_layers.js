import React from 'react';

// Components
import LayerPill from 'pages/app/pulse/layer-pill';

export const LAYERS_PLANET_PULSE = [
  {
    label: 'Forests',
    layers: [
      {
        label: 'Active Fires (VIIRS)',
        id: '5ca12eec-f8fe-49eb-b353-67c9eeb5bc6a',
        '3d': false,
        descriptionPulse:
          <div className="description">
            High confidence fires in the past 7 days affecting <LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="Population" />
          </div>,
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        contextLayersOnTop: false,
        widgets: [],
        basemap: {
          name: 'sentinel',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Brazilian Amazon Deforestation Alerts',
        id: '17b9bf19-e116-4a22-b71a-fe67ce7fd552',
        '3d': false,
        descriptionPulse:
          <div className="description">
            Brazil deforestation alerts in the past 4 months are affecting <LayerPill layerId="cbb309b7-1df1-4638-b821-48db53053d38" label="Intact forest landscapes" /> and <LayerPill layerId="dabcca67-037c-4d11-afc4-69559edec4dc" label="Protected areas" />
          </div>,
        contextLayers: ['cbb309b7-1df1-4638-b821-48db53053d38', 'dabcca67-037c-4d11-afc4-69559edec4dc'],
        contextLayersOnTop: false,
        widgets: [],
        basemap: {
          name: 'other',
          url: 'https://api.mapbox.com/styles/v1/wri/cjd56ttip0i1s2rnxv8py2km5/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid3JpIiwiYSI6Ik9TY2w5RTQifQ.0HV7dQTjK40mk7GpNNA64g'
        }
      },
      {
        label: 'GLAD Deforestation Alerts',
        id: '5b19ee01-1de5-4f65-ad5d-b7d58e487cc5',
        '3d': false,
        descriptionPulse:
          <div className="description">
            Deforestation alerts in the past 24 months are affecting <LayerPill layerId="cbb309b7-1df1-4638-b821-48db53053d38" label="Intact forest landscapes" /> and <LayerPill layerId="dabcca67-037c-4d11-afc4-69559edec4dc" label="Protected areas" />
          </div>,
        contextLayers: ['cbb309b7-1df1-4638-b821-48db53053d38', 'dabcca67-037c-4d11-afc4-69559edec4dc'],
        contextLayersOnTop: false,
        widgets: [],
        basemap: {
          name: 'other',
          url: 'https://api.mapbox.com/styles/v1/wri/cjd56ttip0i1s2rnxv8py2km5/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid3JpIiwiYSI6Ik9TY2w5RTQifQ.0HV7dQTjK40mk7GpNNA64g'
        }
      }
    ]
  },
  {
    label: 'Water',
    layers: [
      {
        label: 'Current floods',
        id: '80d2665b-bba4-4de9-ba5e-d0487e920784',
        '3d': false,
        descriptionPulse:
          <div className="description">
            Detected current floods can affect <LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="Populated areas" />
          </div>,
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        contextLayersOnTop: false,
        widgets: [],
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Coral Reef Bleaching Alerts',
        id: '73db724d-87b9-41cd-912a-b66eb65eebdd',
        '3d': false,
        descriptionPulse:
          <div className="description">
            Bleaching alerts affecting <LayerPill layerId="5522b6ee-66d5-4d2d-9109-ae8e6b7e3a26" label="coral reefs" />
          </div>,
        contextLayers: ['5522b6ee-66d5-4d2d-9109-ae8e6b7e3a26'],
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
    label: 'Food',
    layers: [
      {
        label: 'Current and Projected Food Insecurity',
        id: '0ac7bf69-388a-48b0-a869-c3240031c4bf',
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        contextLayersOnTop: false,
        '3d': false,
        descriptionPulse:
          <div className="description">
            Current and projected food insecurity affecting <LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="population" />
          </div>,
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      }
    ]
  },
  {
    label: 'Disasters',
    layers: [
      {
        label: 'Significant Earthquakes over the past 30 Days',
        id: '5939b34f-42bb-4861-bd4a-308a0ae7a1d6',
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        contextLayersOnTop: false,
        '3d': true,
        markerType: 'bar',
        widgets: [],
        descriptionPulse:
          <div className="description">
            Significant earthquakes over the past 30 days affecting <LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="population" />
          </div>,
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Weekly Volcano Report',
        id: '667ae321-649e-4caa-b761-35e370c776b0',
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        contextLayersOnTop: false,
        '3d': true,
        markerType: 'volcano',
        descriptionPulse:
          <div className="description">
            Volcanoes over the past 7 days affecting <LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="population" />
          </div>,
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Landslide Hazard Alerts',
        id: '50ef9f99-ddca-46b9-bb69-690f0b2ced88',
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        contextLayersOnTop: false,
        '3d': false,
        widgets: [],
        descriptionPulse:
          <div className="description">
            Landslide hazard alerts affecting <LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="population" />
          </div>,
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      }
    ]
  },
  {
    label: 'Society',
    layers: [
      {
        label: 'Conflict and Protest Events in African States',
        id: 'b508a5f8-28f2-41c6-b0f7-eac918083062',
        contextLayers: [],
        contextLayersOnTop: false,
        '3d': false,
        markerType: 'default',
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Conflict and Protest Events in Asian States',
        id: '029b6b49-dd20-4172-8842-6cbba6bdaf87',
        contextLayers: [],
        contextLayersOnTop: false,
        '3d': false,
        markerType: 'default',
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Global Database of Events, Language, and Tone',
        id: 'b51c7412-cb4d-4dab-8eeb-8cc31c131195',
        contextLayers: [],
        contextLayersOnTop: false,
        '3d': false,
        markerType: 'default',
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Migrant Deaths',
        id: 'b51c7412-cb4d-4dab-8eeb-8cc31c131195',
        contextLayers: [],
        contextLayersOnTop: false,
        '3d': false,
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      }

    ]
  },
  {
    label: 'Climate',
    layers: [
      {
        label: 'Air Quality - PM 2.5',
        id: '52a0250f-ae97-462d-b8fb-995e3d8fc084',
        contextLayers: [],
        contextLayersOnTop: false,
        '3d': false,
        widgets: [],
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Air Quality - PM 10',
        id: '1002c7f6-78f7-4fde-a8c3-ba8f8abf2b7f',
        contextLayers: [],
        contextLayersOnTop: false,
        '3d': false,
        widgets: [],
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Air Temperature Anomolies',
        id: 'f1d841cb-a959-4b54-8472-e28f794b2c6a',
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        contextLayersOnTop: false,
        '3d': false,
        widgets: [],
        descriptionPulse:
          <div className="description">
            Air temperature anomalies affecting <LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="population" />
          </div>
      }
    ]
  }
];
