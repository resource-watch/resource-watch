export const LAYERS_PLANET_PULSE = [
  {
    label: 'Forests',
    layers: [
      {
        label: 'VIIRS Active Fires',
        id: '5ca12eec-f8fe-49eb-b353-67c9eeb5bc6a',
        '3d': false,
        markerType: 'default'
      },
      {
        label: 'Brazilian Amazon Deforestation Alerts',
        id: '17b9bf19-e116-4a22-b71a-fe67ce7fd552',
        '3d': false,
        markerType: 'default'
      }
    ]
  },
  {
    label: 'Water',
    layers: [
      {
        label: 'Global Flood Detection System (JRC, Dartmouth Flood Observatory)',
        id: 'd0e35d92-3669-4bc2-b5d6-58b456fbf847',
        '3d': true,
        markerType: 'bar'
      },
      {
        label: 'Drought Monitor - SPEI',
        id: '6f1f8b5d-a6ba-436f-a7bf-b6812d0f3a20',
        '3d': false,
        markerType: 'default'
      },
      {
        label: 'Potential Landslide Areas.',
        id: '50ef9f99-ddca-46b9-bb69-690f0b2ced88',
        '3d': false,
        markerType: 'hemisphere'
      }
    ]
  },
  {
    label: 'Food',
    layers: [
      {
        label: 'Acute Food Insecurity (FEWS NET)',
        id: '0ac7bf69-388a-48b0-a869-c3240031c4bf',
        '3d': false,
        markerType: 'default'
      }
    ]
  },
  {
    label: 'Disasters',
    layers: [
      {
        label: 'Earthquakes Over the Past 30 days',
        id: '5939b34f-42bb-4861-bd4a-308a0ae7a1d6',
        '3d': true,
        markerType: 'bar'
      },
      {
        label: 'Volcanoes over the Past 7 days',
        id: '667ae321-649e-4caa-b761-35e370c776b0',
        '3d': true,
        markerType: 'volcano'
      }
    ]
  },
  {
    label: 'Society',
    layers: [
      {
        label: 'Conflict and Protest Events in African States',
        id: 'b508a5f8-28f2-41c6-b0f7-eac918083062',
        '3d': false,
        markerType: 'default'
      },
      {
        label: 'News Sources',
        id: '2b7d5bca-bdcc-4d75-9901-155eebf9bb8c',
        '3d': true,
        markerType: 'hemisphere'
      }
    ]
  }
];
