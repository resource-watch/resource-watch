import { useState } from 'react';
import PropTypes from 'prop-types';
import { ErrorBoundary } from 'react-error-boundary';

// components
import ErrorFallback from 'components/error-fallback';
import SwipeTypeWidget from './component';
import WidgetShareModal from '../../share-modal';

const CustomErrorFallback = (_props) => (
  <ErrorFallback {..._props} title="Something went wrong loading the widget" />
);

export default {
  title: 'Widget/Map-Swipe',
  component: SwipeTypeWidget,
  argTypes: {},
  decorators: [
    (Story) => (
      <div
        style={{
          width: '100%',
          height: 500,
        }}
      >
        <ErrorBoundary FallbackComponent={CustomErrorFallback}>
          <Story />
        </ErrorBoundary>
      </div>
    ),
  ],
};

function triggerError() {
  throw new Error('this is an sample error');
}

function Template(args) {
  const [isWidgetShareModalVisible, setVisibilityWidgetShareModal] = useState(false);
  return (
    <>
      {args.isError && triggerError()}
      <SwipeTypeWidget {...args} onToggleShare={() => setVisibilityWidgetShareModal(true)} />
      <WidgetShareModal
        onClose={() => {
          setVisibilityWidgetShareModal(false);
        }}
        isVisible={isWidgetShareModalVisible}
        widget={args.widget}
      />
    </>
  );
}

Template.propTypes = {
  args: PropTypes.shape({}).isRequired,
};

export const Default = Template.bind({});

const widget = {
  id: '5a1322ef-8982-4398-aac8-9e53a8dea581',
  type: 'widget',
  name: 'Water Quality Pressure',
  dataset: 'f7bbc39e-81ab-4d91-be37-c12e33cd8436',
  slug: 'Water-Quality-Pressure',
  userId: '60d1fc0d947dc2001bb5135d',
  description: '',
  source: '',
  authors: '',
  application: ['rw'],
  verified: false,
  default: false,
  protected: false,
  defaultEditableWidget: false,
  published: true,
  thumbnailUrl: '',
  freeze: false,
  env: 'production',
  queryUrl: '',
  widgetConfig: {
    lng: 4.504394531250001,
    lat: -28.497660832963472,
    zoom: 4,
    type: 'map',
    paramsConfig: {
      embed: {
        src: '',
      },
      band: null,
      areaIntersection: null,
      filters: [],
      chartType: null,
      aggregateFunction: null,
      orderBy: null,
      size: null,
      color: null,
      category: null,
      value: null,
      limit: 500,
      visualizationType: 'map-slide',
      layer_id: '0f27b5ee-21e0-48d4-81ba-f8d33d773514',
      layer: '0f27b5ee-21e0-48d4-81ba-f8d33d773514',
      layerParams: {
        'c4c7b8e1-1d74-40fe-840c-e8aa185a4461': {
          opacity: 0.75,
        },
        '0f27b5ee-21e0-48d4-81ba-f8d33d773514': {
          opacity: 0.5,
        },
        'abefb374-3355-4110-9c03-c7031f0b61b4': {
          opacity: 1,
        },
        'fe6315f7-e208-441d-9193-9dee6499b349': {
          opacity: 1,
        },
      },
      layersLeft: [
        'c4c7b8e1-1d74-40fe-840c-e8aa185a4461',
        '0f27b5ee-21e0-48d4-81ba-f8d33d773514',
        'abefb374-3355-4110-9c03-c7031f0b61b4',
      ],
      layersRight: [
        'c4c7b8e1-1d74-40fe-840c-e8aa185a4461',
        '0f27b5ee-21e0-48d4-81ba-f8d33d773514',
        'fe6315f7-e208-441d-9193-9dee6499b349',
      ],
      mask: {
        account: 'wri-rw',
        body: {
          layers: [
            {
              type: 'mapnik',
              options: {
                sql: "SELECT cartodb_id, the_geom_webmercator, st_intersects(the_geom, (select the_geom from gadm36_0 where {{geostore_env}} = '{{geostore_id}}' )) as intersect FROM 'wri-rw'.wat_068_rw0_watersheds_edit WHERE level = 3",
              },
            },
          ],
          vectorLayers: [
            {
              paint: {
                'fill-color': '#000',
                'fill-opacity': 0,
              },
              'source-layer': 'layer0',
              type: 'fill',
            },
            {
              paint: {
                'line-color': '#0079B0',
                'line-opacity': 1,
                'line-width': 1,
              },
              'source-layer': 'layer0',
              type: 'line',
            },
          ],
          layerType: 'vector',
        },
      },
    },
  },
  template: false,
  createdAt: '2021-06-30T09:40:24.483Z',
  updatedAt: '2021-07-08T11:38:49.622Z',
  metadata: [],
};

const aoiLayer = {
  id: '972c24e1da2c2baacc7572ee9501abdc',
  provider: 'geojson',
  layerConfig: {
    parse: false,
    data: {
      crs: {},
      features: [
        {
          geometry: {
            coordinates: [
              [
                [-12.093761259, 44.552460756],
                [-14.106357807, 35.660331733],
                [17.065486395, 35.126167008],
                [17.814359529, 47.540103435],
                [-12.093761259, 44.552460756],
              ],
            ],
            type: 'Polygon',
          },
          type: 'Feature',
        },
      ],
      type: 'FeatureCollection',
    },
    body: {
      vectorLayers: [
        {
          id: '972c24e1da2c2baacc7572ee9501abdc-glow',
          type: 'line',
          source: '972c24e1da2c2baacc7572ee9501abdc',
          paint: {
            'line-color': 'hsl(40, 95%, 58%)',
            'line-width': 2,
            'line-offset': -2,
          },
        },
        {
          id: '972c24e1da2c2baacc7572ee9501abdc-line',
          type: 'line',
          source: '972c24e1da2c2baacc7572ee9501abdc',
          paint: {},
        },
      ],
    },
  },
  opacity: 1,
  visibility: true,
  isAreaOfInterest: true,
  bbox: [-14.106357807, 35.126167008, 17.814359529, 47.540103435],
};

Default.args = {
  widget,
  isFetching: false,
  isError: false,
  isInACollection: false,
  aoiLayer,
  bounds: {
    bbox: [-14.106357807, 35.126167008, 17.814359529, 47.540103435],
  },
  layerGroupsBySide: {
    left: [
      {
        id: 'cb738e45-4068-4bd9-b040-cbeef74d4b83',
        visibility: true,
        layers: [
          {
            id: 'c4c7b8e1-1d74-40fe-840c-e8aa185a4461',
            type: 'layer',
            name: 'Marine Protected Areas (polygons)',
            slug: 'Marine-Protected-Areas-polygons',
            dataset: 'cb738e45-4068-4bd9-b040-cbeef74d4b83',
            description:
              'Boundaries of officially designated parks, reserves, and other formal conservation areas around the world that have a substantial marine component. The authors caution that the absence of a management category does not in any way reduce the importance of a protected area, nor does it imply that the site is not being adequately managed or should be excluded from analyses.',
            application: ['rw'],
            iso: [],
            provider: 'cartodb',
            userId: '5d4383b6bc2f700010659e31',
            default: true,
            protected: false,
            published: true,
            env: 'production',
            layerConfig: {
              body: {
                layers: [
                  {
                    options: {
                      cartocss_version: '2.3.0',
                      cartocss:
                        '#layer {polygon-opacity: 0.2; polygon-fill: #0079B0; polygon-gamma-method: power; line-color:#0079B0; line-opacity:0.8; line-width:1}',
                      sql: 'SELECT * FROM bio_007b_rw0_marine_protected_area_polygon_edit',
                    },
                    type: 'cartodb',
                  },
                ],
                maxzoom: 18,
                vectorLayers: [
                  {
                    paint: {
                      'line-color': '#0079B0',
                      'line-opacity': 1,
                      'line-width': 1,
                    },
                    'source-layer': 'layer0',
                    type: 'line',
                    filter: ['all'],
                  },
                  {
                    paint: {
                      'fill-opacity': 0.5,
                      'fill-color': ' #0079B0',
                    },
                    'source-layer': 'layer0',
                    type: 'fill',
                    filter: ['all'],
                  },
                ],
              },
              account: 'rw-nrt',
              layerType: 'vector',
            },
            legendConfig: {
              type: 'basic',
              items: [
                {
                  name: 'Extent',
                  color: '#0079B0',
                  id: 0,
                },
              ],
            },
            interactionConfig: {
              output: [
                {
                  column: 'iucn_cat',
                  format: null,
                  prefix: '',
                  property: 'IUCN Category',
                  suffix: '',
                  type: 'string',
                },
                {
                  column: 'name',
                  format: null,
                  prefix: '',
                  property: 'Name',
                  suffix: '',
                  type: 'string',
                },
                {
                  column: 'status',
                  format: null,
                  prefix: '',
                  property: 'Status',
                  suffix: '',
                  type: 'string',
                },
                {
                  column: 'no_take',
                  format: null,
                  prefix: '',
                  property: 'No-Take Status',
                  suffix: '',
                  type: 'string',
                },
                {
                  column: 'desig_type',
                  format: null,
                  prefix: '',
                  property: 'Designation Type',
                  suffix: '',
                  type: 'string',
                },
                {
                  column: 'own_type',
                  format: null,
                  prefix: '',
                  property: 'Ownership Type',
                  suffix: '',
                  type: 'string',
                },
                {
                  column: 'gov_type',
                  format: null,
                  prefix: '',
                  property: 'Governance Type',
                  suffix: '',
                  type: 'string',
                },
                {
                  column: 'mang_auth',
                  format: null,
                  prefix: '',
                  property: 'Management Authority',
                  suffix: '',
                  type: 'string',
                },
              ],
            },
            applicationConfig: {},
            staticImageConfig: {},
            createdAt: '2021-06-09T12:57:59.293Z',
            updatedAt: '2021-06-09T12:57:59.293Z',
            active: true,
            opacity: 0.75,
          },
        ],
      },
      {
        id: '36ae1411-8ce4-4720-860c-8363af092247',
        visibility: true,
        layers: [
          {
            id: '0f27b5ee-21e0-48d4-81ba-f8d33d773514',
            type: 'layer',
            name: 'Watersheds - Level 3',
            slug: 'Watersheds-Level-3',
            dataset: '36ae1411-8ce4-4720-860c-8363af092247',
            description:
              'Watershed boundaries and sub-basin delineations for level 3 (according to the Pfafstetter coding system). This level corresponds to the largest river basins of each continent.',
            application: ['rw'],
            iso: [],
            provider: 'cartodb',
            userId: '5d4383b6bc2f700010659e31',
            default: true,
            protected: false,
            published: true,
            env: 'production',
            layerConfig: {
              body: {
                layers: [
                  {
                    options: {
                      cartocss_version: '2.3.0',
                      cartocss:
                        '#layer {polygon-opacity: 0.9;polygon-fill:#ffd380;line-color: #e1b562;line-width: 2;line-opacity: 1;}',
                      sql: 'SELECT * FROM wat_068_rw0_watersheds_edit WHERE level = 3',
                    },
                    type: 'mapnik',
                  },
                ],
                maxzoom: 18,
                vectorLayers: [
                  {
                    paint: {
                      'fill-opacity': 0.9,
                      'fill-color': '#ffd380',
                    },
                    'source-layer': 'layer0',
                    type: 'fill',
                    filter: ['all'],
                  },
                  {
                    paint: {
                      'line-color': ' #cda14e',
                      'line-width': 2,
                      'line-opacity': 1,
                    },
                    'source-layer': 'layer0',
                    type: 'line',
                    filter: ['all'],
                  },
                ],
              },
              account: 'wri-rw',
              layerType: 'vector',
            },
            legendConfig: {
              items: [
                {
                  color: '#ffd380',
                  name: 'Extent',
                  id: 0,
                },
              ],
              type: 'basic',
            },
            interactionConfig: {
              output: [
                {
                  column: 'sub_area',
                  format: '0,0.0[0]',
                  prefix: '',
                  property: 'Area',
                  suffix: ' km²',
                  type: 'number',
                },
                {
                  column: 'hybas_id',
                  format: '0000',
                  prefix: '',
                  property: 'Basin ID',
                  suffix: '',
                  type: 'number',
                },
              ],
            },
            applicationConfig: {},
            staticImageConfig: {},
            createdAt: '2021-06-09T12:58:11.354Z',
            updatedAt: '2021-06-09T12:58:11.354Z',
            active: true,
            opacity: 0.5,
          },
        ],
      },
      {
        id: 'cb75c884-7e0a-436d-89c8-c27bf6fb31dc',
        visibility: true,
        layers: [
          {
            id: 'abefb374-3355-4110-9c03-c7031f0b61b4',
            type: 'layer',
            name: '2000 Coastal Eutrophication Potential',
            slug: '2000-Coastal-Eutrophication-Potential_1',
            dataset: 'cb75c884-7e0a-436d-89c8-c27bf6fb31dc',
            description:
              'Coastal eutrophication potential measures the potential for riverine loadings of nitrogen, phosphorus and silica to stimulate harmful algal blooms in coastal waters. Higher values indicate higher levels of excess nutrients with respect to silica, creating more favorable conditions for harmful algal growth and eutrophication in coastal waters downstream. Values are calculated based on data from the year 2000.',
            application: ['rw'],
            iso: [],
            provider: 'cartodb',
            userId: '5d4383b6bc2f700010659e31',
            default: true,
            protected: false,
            published: true,
            env: 'production',
            layerConfig: {
              account: 'wri-rw',
              body: {
                maxzoom: 18,
                layers: [
                  {
                    type: 'mapnik',
                    options: {
                      sql: 'SELECT * FROM wat_059_aqueduct_coastal_eutrophication_potential',
                      cartocss:
                        '#layer {polygon-opacity:1; line-width:0; line-color:#FFF; line-opacity:0;} [cep_cat=4]{polygon-fill:#990000;}[cep_cat=3]{polygon-fill:#FF1900;} [cep_cat=2]{polygon-fill:#FF9900;} [cep_cat=1]{polygon-fill:#FFE600;} [cep_cat=0]{polygon-fill:#FFFF99;}[cep_cat=-1]{polygon-fill:#4E4E4E;}',
                      cartocss_version: '2.3.0',
                    },
                  },
                ],
                vectorLayers: [
                  {
                    paint: {
                      'fill-opacity': 1,
                    },
                    'source-layer': 'layer0',
                    type: 'fill',
                    filter: ['all'],
                  },
                  {
                    paint: {
                      'fill-color': '#990000',
                    },
                    'source-layer': 'layer0',
                    type: 'fill',
                    filter: ['all', ['==', 'cep_cat', 4]],
                  },
                  {
                    paint: {
                      'fill-color': '#FF1900',
                    },
                    'source-layer': 'layer0',
                    type: 'fill',
                    filter: ['all', ['==', 'cep_cat', 3]],
                  },
                  {
                    paint: {
                      'fill-color': '#FF9900',
                    },
                    'source-layer': 'layer0',
                    type: 'fill',
                    filter: ['all', ['==', 'cep_cat', 2]],
                  },
                  {
                    paint: {
                      'fill-color': '#FFE600',
                    },
                    'source-layer': 'layer0',
                    type: 'fill',
                    filter: ['all', ['==', 'cep_cat', 1]],
                  },
                  {
                    paint: {
                      'fill-color': '#FFFF99',
                    },
                    'source-layer': 'layer0',
                    type: 'fill',
                    filter: ['all', ['==', 'cep_cat', 0]],
                  },
                  {
                    paint: {
                      'fill-color': '#4E4E4E',
                    },
                    'source-layer': 'layer0',
                    type: 'fill',
                    filter: ['all', ['==', 'cep_cat', -1]],
                  },
                  {
                    paint: {
                      'line-width': 0.1,
                      'line-color': '#525252',
                      'line-opacity': 0.3,
                    },
                    'source-layer': 'layer0',
                    type: 'line',
                    filter: ['all'],
                  },
                ],
              },
              layerType: 'vector',
            },
            legendConfig: {
              items: [
                {
                  id: 0,
                  color: '#FFFF99',
                  name: '⠀Low⠀',
                },
                {
                  id: 1,
                  color: '#FFE600',
                  name: '⠀Low to⠀ ⠀medium⠀',
                },
                {
                  id: 1,
                  color: '#FF9900',
                  name: '⠀Medium to⠀ ⠀high⠀',
                },
                {
                  id: 2,
                  color: '#FF1900',
                  name: '⠀High⠀',
                },
                {
                  id: 3,
                  color: '#990000',
                  name: '⠀Extremely⠀ ⠀high⠀',
                },
                {
                  id: 4,
                  color: '#4E4E4E',
                  name: '⠀No⠀ ⠀data⠀',
                },
              ],
              type: 'choropleth',
            },
            interactionConfig: {
              output: [
                {
                  type: 'string',
                  suffix: '',
                  property: 'Coastal eutrophication potential',
                  prefix: '',
                  format: null,
                  column: 'cep_label',
                },
                {
                  column: 'cartodb_id',
                  format: null,
                  prefix: '',
                  property: 'Area ID',
                  suffix: '',
                  type: 'number',
                },
              ],
            },
            applicationConfig: {},
            staticImageConfig: {},
            createdAt: '2021-06-09T12:58:25.289Z',
            updatedAt: '2021-06-09T12:58:25.289Z',
            active: true,
            opacity: 1,
          },
        ],
      },
    ],
    right: [
      {
        id: 'cb738e45-4068-4bd9-b040-cbeef74d4b83',
        visibility: true,
        layers: [
          {
            id: 'c4c7b8e1-1d74-40fe-840c-e8aa185a4461',
            type: 'layer',
            name: 'Marine Protected Areas (polygons)',
            slug: 'Marine-Protected-Areas-polygons',
            dataset: 'cb738e45-4068-4bd9-b040-cbeef74d4b83',
            description:
              'Boundaries of officially designated parks, reserves, and other formal conservation areas around the world that have a substantial marine component. The authors caution that the absence of a management category does not in any way reduce the importance of a protected area, nor does it imply that the site is not being adequately managed or should be excluded from analyses.',
            application: ['rw'],
            iso: [],
            provider: 'cartodb',
            userId: '5d4383b6bc2f700010659e31',
            default: true,
            protected: false,
            published: true,
            env: 'production',
            layerConfig: {
              body: {
                layers: [
                  {
                    options: {
                      cartocss_version: '2.3.0',
                      cartocss:
                        '#layer {polygon-opacity: 0.2; polygon-fill: #0079B0; polygon-gamma-method: power; line-color:#0079B0; line-opacity:0.8; line-width:1}',
                      sql: 'SELECT * FROM bio_007b_rw0_marine_protected_area_polygon_edit',
                    },
                    type: 'cartodb',
                  },
                ],
                maxzoom: 18,
                vectorLayers: [
                  {
                    paint: {
                      'line-color': '#0079B0',
                      'line-opacity': 1,
                      'line-width': 1,
                    },
                    'source-layer': 'layer0',
                    type: 'line',
                    filter: ['all'],
                  },
                  {
                    paint: {
                      'fill-opacity': 0.5,
                      'fill-color': ' #0079B0',
                    },
                    'source-layer': 'layer0',
                    type: 'fill',
                    filter: ['all'],
                  },
                ],
              },
              account: 'rw-nrt',
              layerType: 'vector',
            },
            legendConfig: {
              type: 'basic',
              items: [
                {
                  name: 'Extent',
                  color: '#0079B0',
                  id: 0,
                },
              ],
            },
            interactionConfig: {
              output: [
                {
                  column: 'iucn_cat',
                  format: null,
                  prefix: '',
                  property: 'IUCN Category',
                  suffix: '',
                  type: 'string',
                },
                {
                  column: 'name',
                  format: null,
                  prefix: '',
                  property: 'Name',
                  suffix: '',
                  type: 'string',
                },
                {
                  column: 'status',
                  format: null,
                  prefix: '',
                  property: 'Status',
                  suffix: '',
                  type: 'string',
                },
                {
                  column: 'no_take',
                  format: null,
                  prefix: '',
                  property: 'No-Take Status',
                  suffix: '',
                  type: 'string',
                },
                {
                  column: 'desig_type',
                  format: null,
                  prefix: '',
                  property: 'Designation Type',
                  suffix: '',
                  type: 'string',
                },
                {
                  column: 'own_type',
                  format: null,
                  prefix: '',
                  property: 'Ownership Type',
                  suffix: '',
                  type: 'string',
                },
                {
                  column: 'gov_type',
                  format: null,
                  prefix: '',
                  property: 'Governance Type',
                  suffix: '',
                  type: 'string',
                },
                {
                  column: 'mang_auth',
                  format: null,
                  prefix: '',
                  property: 'Management Authority',
                  suffix: '',
                  type: 'string',
                },
              ],
            },
            applicationConfig: {},
            staticImageConfig: {},
            createdAt: '2021-06-09T12:57:59.293Z',
            updatedAt: '2021-06-09T12:57:59.293Z',
            active: true,
            opacity: 0.75,
          },
        ],
      },
      {
        id: '36ae1411-8ce4-4720-860c-8363af092247',
        visibility: true,
        layers: [
          {
            id: '0f27b5ee-21e0-48d4-81ba-f8d33d773514',
            type: 'layer',
            name: 'Watersheds - Level 3',
            slug: 'Watersheds-Level-3',
            dataset: '36ae1411-8ce4-4720-860c-8363af092247',
            description:
              'Watershed boundaries and sub-basin delineations for level 3 (according to the Pfafstetter coding system). This level corresponds to the largest river basins of each continent.',
            application: ['rw'],
            iso: [],
            provider: 'cartodb',
            userId: '5d4383b6bc2f700010659e31',
            default: true,
            protected: false,
            published: true,
            env: 'production',
            layerConfig: {
              body: {
                layers: [
                  {
                    options: {
                      cartocss_version: '2.3.0',
                      cartocss:
                        '#layer {polygon-opacity: 0.9;polygon-fill:#ffd380;line-color: #e1b562;line-width: 2;line-opacity: 1;}',
                      sql: 'SELECT * FROM wat_068_rw0_watersheds_edit WHERE level = 3',
                    },
                    type: 'mapnik',
                  },
                ],
                maxzoom: 18,
                vectorLayers: [
                  {
                    paint: {
                      'fill-opacity': 0.9,
                      'fill-color': '#ffd380',
                    },
                    'source-layer': 'layer0',
                    type: 'fill',
                    filter: ['all'],
                  },
                  {
                    paint: {
                      'line-color': ' #cda14e',
                      'line-width': 2,
                      'line-opacity': 1,
                    },
                    'source-layer': 'layer0',
                    type: 'line',
                    filter: ['all'],
                  },
                ],
              },
              account: 'wri-rw',
              layerType: 'vector',
            },
            legendConfig: {
              items: [
                {
                  color: '#ffd380',
                  name: 'Extent',
                  id: 0,
                },
              ],
              type: 'basic',
            },
            interactionConfig: {
              output: [
                {
                  column: 'sub_area',
                  format: '0,0.0[0]',
                  prefix: '',
                  property: 'Area',
                  suffix: ' km²',
                  type: 'number',
                },
                {
                  column: 'hybas_id',
                  format: '0000',
                  prefix: '',
                  property: 'Basin ID',
                  suffix: '',
                  type: 'number',
                },
              ],
            },
            applicationConfig: {},
            staticImageConfig: {},
            createdAt: '2021-06-09T12:58:11.354Z',
            updatedAt: '2021-06-09T12:58:11.354Z',
            active: true,
            opacity: 0.5,
          },
        ],
      },
      {
        id: 'f7bbc39e-81ab-4d91-be37-c12e33cd8436',
        visibility: true,
        layers: [
          {
            id: 'fe6315f7-e208-441d-9193-9dee6499b349',
            type: 'layer',
            name: '2015 Land Cover',
            slug: '2015-Land-Cover_2',
            dataset: 'f7bbc39e-81ab-4d91-be37-c12e33cd8436',
            description:
              'Discrete land cover classification for 2015, according to UN-FAO LCCS, with 11 classes shown. Forests are shown as two classes (open and closed), unknown and ocean classes are not shown.',
            application: ['rw'],
            iso: [],
            provider: 'gee',
            userId: '5d4383b6bc2f700010659e31',
            default: true,
            protected: false,
            published: true,
            env: 'production',
            layerConfig: {
              type: 'gee',
              assetId: 'COPERNICUS/Landcover/100m/Proba-V-C3/Global/2015',
              isImageCollection: false,
              body: {
                styleType: 'sld',
                sldValue:
                  '<RasterSymbolizer><ChannelSelection>   <GrayChannel>   <SourceChannelName>discrete_classification</SourceChannelName>        </GrayChannel>        </ChannelSelection> <ColorMap type="values" extended="false" ><ColorMapEntry color="#FFBB22" quantity="20" label="Shrubland" opacity="1" /><ColorMapEntry color="#FFFF4C" quantity="30" label="Herbaceous vegetation" opacity="1" /><ColorMapEntry color="#F096FF" quantity="40" label="Cropland" opacity="1" /><ColorMapEntry color="#FA0000" quantity="50" label="Urban / Built up" opacity="1" /><ColorMapEntry color="#B4B4B4" quantity="60" label="Bare / sparse vegetation" opacity="1" /><ColorMapEntry color="#F0F0F0" quantity="70" label="Snow and ice" opacity="1" /><ColorMapEntry color="#0032C8" quantity="80" label="Permanent water bodies" opacity="1" /><ColorMapEntry color="#0096A0" quantity="90" label="Herbaceous wetland" opacity="1" /><ColorMapEntry color="#FAE6A0" quantity="100" label="Moss and lichen" opacity="1" /><ColorMapEntry color="#007800" quantity="111" label="Closed forest, evergreen needle leaf" opacity="1" /><ColorMapEntry color="#007800" quantity="112" label="Closed forest, evergreen broad leaf" opacity="1" /><ColorMapEntry color="#007800" quantity="113" label="Closed forest, deciduous needle leaf" opacity="1" /><ColorMapEntry color="#007800" quantity="114" label="Closed forest, deciduous broad leaf" opacity="1" /><ColorMapEntry color="#007800" quantity="115" label="Closed forest, mixed" opacity="1" /><ColorMapEntry color="#007800" quantity="116" label="Closed forest, unknown type" opacity="1" /><ColorMapEntry color="#648c00" quantity="121" label="Open forest, evergreen needle leaf" opacity="1" /><ColorMapEntry color="#648c00" quantity="122" label="Open forest, evergreen broad leaf" opacity="1" /><ColorMapEntry color="#648c00" quantity="123" label="Open forest, deciduous needle leaf" opacity="1" /><ColorMapEntry color="#648c00" quantity="124" label="Open forest, deciduous broad leaf" opacity="1" /><ColorMapEntry color="#648c00" quantity="125" label="Open forest, mixed" opacity="1" /><ColorMapEntry color="#648c00" quantity="126" label="Open forest, unknown type" opacity="1" /></ColorMap></RasterSymbolizer>',
                url: 'https://staging-api.resourcewatch.org/v1/layer/fe6315f7-e208-441d-9193-9dee6499b349/tile/gee/{z}/{x}/{y}',
              },
              timeline: true,
              order: 2015,
              timelineLabel: '2015',
            },
            legendConfig: {
              type: 'basic',
              items: [
                {
                  name: 'Closed Forest',
                  color: '#007800',
                  id: 0,
                },
                {
                  name: 'Open Forest',
                  color: '#648c00',
                  id: 1,
                },
                {
                  name: 'Shrubland',
                  color: '#FFBB22',
                  id: 2,
                },
                {
                  name: 'Herbaceous vegetation',
                  color: '#FFFF4C',
                  id: 3,
                },
                {
                  name: 'Herbaceous wetland',
                  color: '#0096A0',
                  id: 4,
                },
                {
                  name: 'Moss and lichen',
                  color: '#FAE6A0',
                  id: 5,
                },
                {
                  name: 'Bare / sparse vegetation',
                  color: '#B4B4B4',
                  id: 6,
                },
                {
                  name: 'Urban / built up',
                  color: '#FA0000',
                  id: 7,
                },
                {
                  name: 'Cropland',
                  color: '#F096FF',
                  id: 8,
                },
                {
                  name: 'Snow and ice',
                  color: '#F0F0F0',
                  id: 9,
                },
                {
                  name: 'Permanent water bodies',
                  color: '#0032C8',
                  id: 10,
                },
              ],
            },
            interactionConfig: {
              type: 'intersection',
              config: {
                url: 'https://api.resourcewatch.org/v1/query/b2f00f99-46ed-43e6-a7a1-a5809d9369d4?sql=select st_summarystats(rast, \'discrete_classification\', false) as x from \'COPERNICUS/Landcover/100m/Proba-V-C3/Global/2015\' where ST_INTERSECTS(ST_SetSRID(ST_GeomFromGeoJSON(\'{"type":"Point","coordinates":[{{lng}},{{lat}}]}\'),4326),the_geom)',
              },
              output: [
                {
                  column: 'x.discrete_classification.mean',
                  property: 'Classification',
                  type: 'number',
                  format: '0',
                  prefix: ' ',
                  suffix: ' ',
                },
              ],
            },
            applicationConfig: {},
            staticImageConfig: {},
            createdAt: '2021-06-09T12:58:16.923Z',
            updatedAt: '2021-06-25T20:50:32.080Z',
            active: true,
            opacity: 1,
          },
        ],
      },
    ],
  },
};
