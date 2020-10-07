export const getUserAreaLayer = ({ id = 'user-area', geojson }) => ({
  id,
  provider: 'geojson',
  layerConfig: {
    parse: false,
    data: geojson,
    body: {
      vectorLayers: [
        {
          id: 'user-area-line',
          type: 'line',
          source: 'user-area',
          paint: { 'line-color': '#fab72e' },
        },
        {
          id: 'user-area-fill',
          type: 'fill',
          source: 'user-area',
          paint: {
            'fill-color': '#fab72e',
            'fill-opacity': 0.2,
          },
        },
      ],
    },
  },
});

export default { getUserAreaLayer };
