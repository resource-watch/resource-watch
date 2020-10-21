export const getUserAreaLayer = ({ id = 'user-area', geojson }) => ({
  id,
  provider: 'geojson',
  layerConfig: {
    parse: false,
    data: geojson,
    body: {
      vectorLayers: [
        {
          id: `${id}-line`,
          type: 'line',
          source: id,
          paint: { 'line-color': '#fab72e' },
        },
        {
          id: `${id}-fill`,
          type: 'fill',
          source: id,
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
