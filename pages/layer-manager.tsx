import Map from 'components/map';
import LayerManager from 'components/map/layer-manager';

import { APILayerSpec } from 'types/layer';

const layers: APILayerSpec[] = [
  {
    id: 'b68b2532-0c3c-4285-8d59-327f2091d4d3',
    type: 'geojson',
    name: 'December 12, 2021 00:00 CT O₃ Concentration (ppb)',
    slug: 'December-12-2021-0000-CT-O-Concentration-ppb_2',
    dataset: '00d6bae1-e105-4165-8230-ee73a8128538',
    description:
      'Air quality forecast for ozone (O₃) concentrations at Earth’s surface on indicated date, expressed in parts per billion (ppb).',
    application: ['rw'],
    iso: [],
    provider: 'wms',
    userId: '57a0aa1071e394dd32ffe137',
    default: false,
    protected: false,
    published: true,
    env: 'staging',
    layerConfig: {
      body: {
        sldValue:
          '<RasterSymbolizer><ChannelSelection>   <GrayChannel>   <SourceChannelName>b1</SourceChannelName>        </GrayChannel>        </ChannelSelection> <ColorMap type="ramp" extended="false" ><ColorMapEntry color="#a50f15" quantity="0" label="" opacity="1" /><ColorMapEntry color="#de2d26" quantity="20" label="" opacity="1" /><ColorMapEntry color="#fb6a4a" quantity="40" label="" /><ColorMapEntry color="#fcae91" quantity="60" label="" /><ColorMapEntry color="#fee5d9" quantity="80" label="" /></ColorMap></RasterSymbolizer>',
        styleType: 'sld',
      },
      assetId:
        'projects/resource-watch-gee/loc_mcaqf_mexico_city_aq_forecast/O3/loc_mcaqf_mexico_city_aq_forecast_O3_20211211_24',
      timelineLabel: '024',
      order: 24,
      timeline: true,
      type: 'raster',
      lmMetadata: {
        version: '4.0',
        'legacy-keys': ['assetId', 'order', 'timelineLabel', 'timeline', 'body'],
      },
      source: {
        provider: {
          type: 'feature-service',
          options: {
            tiler:
              'https://gis-gfw.wri.org/arcgis/rest/services/country_data/south_america/MapServer/9',
          },
        },
        parse: false,
        type: 'geojson',
        maxzoom: 12,
      },
    },
    legendConfig: {
      items: [
        {
          color: '#a50f15',
          name: '0',
          id: 0,
        },
        {
          color: '#de2d26',
          name: '20',
          id: 1,
        },
        {
          color: '#fb6a4a',
          name: '40',
          id: 2,
        },
        {
          color: '#fcae91',
          name: '60',
          id: 3,
        },
        {
          color: '#fee5d9',
          name: '≥80',
          id: 4,
        },
      ],
      type: 'gradient',
    },
    interactionConfig: {
      type: 'intersection',
      config: {
        url: 'https://api.resourcewatch.org/v1/query/50168169-0ce3-41e7-8056-29d87a18e66d?sql=select st_summarystats(rast, \'b1\', false) as x from \'projects/resource-watch-gee/loc_mcaqf_mexico_city_aq_forecast/O3/loc_mcaqf_mexico_city_aq_forecast_O3_20211211_24\' where ST_INTERSECTS(ST_SetSRID(ST_GeomFromGeoJSON(\'{"type":"Point","coordinates":[{{lng}},{{lat}}]}\'),4326),the_geom)',
      },
      output: [
        {
          column: 'x.b1.mean',
          property: 'Ozone concentration',
          type: 'number',
          format: '0.00',
          prefix: ' ',
          suffix: ' ppb',
        },
      ],
    },
    applicationConfig: {},
    staticImageConfig: {},
    createdAt: '2021-12-13T11:33:18.192Z',
    updatedAt: '2021-12-13T15:12:32.709Z',
  },
];

const LayerManagerPage = ({}): JSX.Element => {
  return (
    <div className="absolute w-full h-full">
      <Map onMapViewportChange={() => false}>
        {(map) => <LayerManager map={map} layers={layers} />}
      </Map>
    </div>
  );
};

export default LayerManagerPage;
