export const LAYERS_PLANET_PULSE = [
  {
    label: 'Forests',
    layers: [
      {
        label: 'VIIRS Active Fires',
        id: '5ca12eec-f8fe-49eb-b353-67c9eeb5bc6a',
        '3d': false,
        markerType: 'default',
        widgets: ['d409858d-9beb-4df5-ae48-bc0d6e9cda25']
      },
      {
        label: 'Brazilian Amazon Deforestation Alerts',
        id: '17b9bf19-e116-4a22-b71a-fe67ce7fd552',
        '3d': false,
        markerType: 'default',
        widgets: ['5f5f7899-ccd2-4477-aa7e-43805880eb33']
      }
    ]
  },
  {
    label: 'Water',
    layers: [
      {
        label: 'Floods news reports',
        id: 'd0e35d92-3669-4bc2-b5d6-58b456fbf847',
        '3d': true,
        markerType: 'bar',
        widgets: ['94b43a46-5594-46fe-8484-46e0dd73197b']
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
      },
      {
        label: 'Current floods.',
        id: '855a05d1-4af2-4f74-8982-6b74153bc327',
        '3d': false,
        markerType: 'default',
        widgets: ['2b317fa3-8716-4923-9f52-94943c2bced9']
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
        markerType: 'bar',
        widgets: ['b3065d7e-b63b-40e2-9dd1-b95ad8e5aee1']
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
        markerType: 'hemisphere',
        widgets: ['90e0c611-8b01-433a-b086-cadfc0127a45']
      }
    ]
  },
  {
    label: 'Climate',
    layers: [
      {
        label: 'Air Quality (Open AQ and NASA)',
        id: '1002c7f6-78f7-4fde-a8c3-ba8f8abf2b7f',
        '3d': false,
        markerType: 'default',
        widgets: ['349aae2c-d39f-4a9f-8a90-3fe7f73a25ce']
      }
    ]
  }
];
