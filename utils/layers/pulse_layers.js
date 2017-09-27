export const LAYERS_PLANET_PULSE = [
  {
    label: 'Forests',
    layers: [
      {
        label: 'VIIRS Active Fires',
        id: '22c9c1bc-fc40-4c85-ae70-a7c837c126f2',
        '3d': false,
        markerType: 'default'
      },
      {
        label: 'Deforestation Alert System, SAD alerts (Imazon)',
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
        id: 'd936031f-51fa-45d8-b945-b52175106fc3',
        '3d': true,
        markerType: 'bar'
      },
      {
        label: 'SPI',
        id: '6f1f8b5d-a6ba-436f-a7bf-b6812d0f3a20',
        '3d': false,
        markerType: 'default'
      },
      {
        label: 'Landslide Risk Locations (NASA)',
        id: '64f78c2e-2692-4842-b904-bf6aeb3d9c68',
        '3d': true,
        markerType: 'bar'
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
        label: 'Earthquakes Over the Past 30 days (USGS)',
        id: '5939b34f-42bb-4861-bd4a-308a0ae7a1d6',
        '3d': true,
        markerType: 'bar'
      },
      {
        label: 'Weekly Volcano Report (Smithsonian)',
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
        label: 'Conflict and Protest Data (ACLED)',
        id: 'a180e159-ece6-4a23-9a14-eafcaf19a35e',
        '3d': true,
        markerType: 'bar'
      },
      {
        label: 'Tone and Events Database (GDELT)',
        id: '0e3457f2-b9b0-4902-bfc9-014e12d8c21a',
        '3d': true,
        markerType: 'hemisphere'
      }
    ]
  }
];
