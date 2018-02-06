export const LAYERS_PLANET_PULSE = [
  {
    label: 'Forests',
    layers: [
      {
        label: 'Active Fires (VIIRS)',
        id: '5ca12eec-f8fe-49eb-b353-67c9eeb5bc6a',
        '3d': false,
        markerType: 'default',
        description:'Fires in the past 7 days affecting {{layer}}',
        contextLayers: [{id:'84229e01-4e61-4c08-a7dd-efb7259dd85d', label:'Population density'}],
        widgets: ['d409858d-9beb-4df5-ae48-bc0d6e9cda25'],
        basemap: {
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Brazilian Amazon Deforestation Alerts',
        id: '17b9bf19-e116-4a22-b71a-fe67ce7fd552',
        '3d': false,
        markerType: 'default',
        description:'Deforestation alerts in the past 7 days affecting {{layer}}',
        contextLayers: [{id:'cbb309b7-1df1-4638-b821-48db53053d38'}, {id:'dabcca67-037c-4d11-afc4-69559edec4dc'}],
        widgets: ['5f5f7899-ccd2-4477-aa7e-43805880eb33']
      },
      {
        label: 'GLAD Deforestation Alerts',
        id: '5b19ee01-1de5-4f65-ad5d-b7d58e487cc5',
        '3d': false,
        markerType: 'default',
        description:'Deforestation alerts in the past 7 days affecting {{layer}}',
        contextLayers: [{id:'cbb309b7-1df1-4638-b821-48db53053d38'}, {id:'dabcca67-037c-4d11-afc4-69559edec4dc'}],
        widgets: ['5f5f7899-ccd2-4477-aa7e-43805880eb33']
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
        markerType: 'hemisphere',
        description:'Deforestation alerts in the past 7 days affecting {{layer}}',
        contextLayers: [{id:'84229e01-4e61-4c08-a7dd-efb7259dd85d', label:'Population density'}],
        widgets: ['279f8f52-83df-417d-a32e-f433c49e3288']
      },
      {
        label: 'Coral Reef Bleaching Alerts',
        id: '73db724d-87b9-41cd-912a-b66eb65eebdd',
        '3d': false,
        markerType: 'hemisphere',
        description:'Deforestation alerts in the past 7 days affecting {{layer}}',
        contextLayers: ['5522b6ee-66d5-4d2d-9109-ae8e6b7e3a26'],
        widgets: ['279f8f52-83df-417d-a32e-f433c49e3288']
      }
    ]
  },
  {
    label: 'Food',
    layers: [
      {
        label: 'Current and Projected Food Insecurity',
        id: '0ac7bf69-388a-48b0-a869-c3240031c4bf',
        description:'Deforestation alerts in the past 7 days affecting {{layer}}',
        contextLayers: [{id:'84229e01-4e61-4c08-a7dd-efb7259dd85d', label:'Population'}],
        '3d': false,

        markerType: 'default'
      }
    ]
  },
  {
    label: 'Disasters',
    layers: [
      {
        label: 'Significant Earthquakes over the past 30 Days',
        id: '5939b34f-42bb-4861-bd4a-308a0ae7a1d6',
        description:'Deforestation alerts in the past 7 days affecting {{layer}}',
        contextLayers: [{id:'84229e01-4e61-4c08-a7dd-efb7259dd85d', label:'Population'}],
        '3d': true,
        markerType: 'bar',
        widgets: ['b3065d7e-b63b-40e2-9dd1-b95ad8e5aee1']
      },
      {
        label: 'Weekly Volcano Report',
        id: '667ae321-649e-4caa-b761-35e370c776b0',
        description:'Deforestation alerts in the past 7 days affecting {{layer}}',
        contextLayers: [{id:'84229e01-4e61-4c08-a7dd-efb7259dd85d', label:'Population density'}],
        '3d': true,
        markerType: 'volcano'
      },
      {
        label: 'Landslide Hazard Alerts',
        id: '50ef9f99-ddca-46b9-bb69-690f0b2ced88',
        description:'Deforestation alerts in the past 7 days affecting {{layer}}',
        contextLayers: [{id:'84229e01-4e61-4c08-a7dd-efb7259dd85d', label:'Population density'}],
        '3d': false,
        markerType: 'hemisphere',
        widgets: ['279f8f52-83df-417d-a32e-f433c49e3288']
      }
    ]
  },
  {
    label: 'Society',
    layers: [
      // {
      //  label: 'Conflict and Protest Events in African States',
      //  id: 'b508a5f8-28f2-41c6-b0f7-eac918083062',
      //  contextLayers: [],
      //  '3d': false,
      //  markerType: 'default'
      // },
      // {
      //  label: 'Conflict and Protest Events in Asian States',
      //  id: '029b6b49-dd20-4172-8842-6cbba6bdaf87',
      //  contextLayers: [],
      //  '3d': false,
      //  markerType: 'default'
      // },
      // {
      //  label: 'Global Database of Events, Language, and Tone',
      //  id: 'b51c7412-cb4d-4dab-8eeb-8cc31c131195',
      //  contextLayers: [],
      //  '3d': false,
      //  markerType: 'default'
      // },
      {
        label: 'Migrant Deaths',
        id: 'b51c7412-cb4d-4dab-8eeb-8cc31c131195',
        description:'Deforestation alerts in the past 7 days affecting {{layer}}',
        contextLayers: [],
        '3d': false,
        markerType: 'default'
      }

    ]
  },
  {
    label: 'Climate',
    layers: [
      {
        label: 'Air Quality - PM 2.5',
        id: '52a0250f-ae97-462d-b8fb-995e3d8fc084',
        description:'Deforestation alerts in the past 7 days',
        contextLayers: [],
        '3d': false,
        markerType: 'default',
        widgets: ['349aae2c-d39f-4a9f-8a90-3fe7f73a25ce']
      },
      {
        label: 'Air Quality - PM 10',
        id: '1002c7f6-78f7-4fde-a8c3-ba8f8abf2b7f',
        description:'Deforestation alerts in the past 7 days',
        contextLayers: [],
        '3d': false,
        markerType: 'default',
        widgets: ['349aae2c-d39f-4a9f-8a90-3fe7f73a25ce']
      },
      {
        label: 'Air Temperature Anomolies',
        id: '1002c7f6-78f7-4fde-a8c3-ba8f8abf2b7f',
        description:'Deforestation alerts in the past 7 days affecting {{layer}}',
        contextLayers: [{id:'84229e01-4e61-4c08-a7dd-efb7259dd85d', label:'Population density'}],
        '3d': false,
        markerType: 'default',
        widgets: ['349aae2c-d39f-4a9f-8a90-3fe7f73a25ce']
      }
    ]
  }
];
