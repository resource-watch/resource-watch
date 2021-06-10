import {
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  ErrorBoundary,
} from 'react-error-boundary';

// components
import ErrorFallback from 'components/error-fallback';
import MapTypeWidget from './component';
import WidgetShareModal from '../../share-modal';

const CustomErrorFallback = ((_props) => (
  <ErrorFallback
    {..._props}
    title="Something went wrong loading the widget"
  />
));

export default {
  title: 'Widget/Map',
  component: MapTypeWidget,
  argTypes: {},
  decorators: [
    (Story) => (
      <div style={{
        width: '100%',
        height: 500,
      }}
      >
        <ErrorBoundary
          FallbackComponent={CustomErrorFallback}
        >
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
      <MapTypeWidget
        {...args}
        onToggleShare={() => setVisibilityWidgetShareModal(true)}
      />
      <WidgetShareModal
        onClose={() => { setVisibilityWidgetShareModal(false); }}
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
export const WithAreaOfInterest = Template.bind({});
export const WithMultipleLayers = Template.bind({});

const widget = {
  id: '626ed7d7-efdd-4697-aee0-15ddb2f86d35',
  name: 'Coral reefs are the \'rainforest of the seas,\' home to a quarter of all marine species',
  dataset: '1d23838e-40da-4cf3-b61c-56258d3a5c56',
  slug: 'Coral-reefs-are-the-rainforest-of-the-seas-home-to-a-quarter-of-all-marine-species_1',
  userId: '5f15f3961f753f0010b897d8',
  description: '2005 Coral Reef Locations Coral reef areas Description Mapped coral reefs in 2005. Corals exist in temperate and tropical waters, but shallow-water reefs are centered around the equator. Mapping reefs provides a baseline for monitoring and managing threats to this biodiverse ecosystem.',
  source: '',
  authors: '',
  application: [
    'rw',
  ],
  verified: false,
  default: false,
  protected: false,
  defaultEditableWidget: false,
  published: true,
  thumbnailUrl: '',
  freeze: false,
  env: 'production',
  widgetConfig: {
    type: 'map',
    layer_id: '5de4d3c8-bd99-4fa2-99f2-5724275afd67',
    zoom: 4,
    lat: -7.231698708367139,
    lng: 490.7896391162598,
    bounds: [
      [
        -25.403584973186703,
        471.0142484912598,
      ],
      [
        11.695272733029402,
        510.5650297412598,
      ],
    ],
    bbox: [
      -25.403584973186703,
      471.0142484912598,
      11.695272733029402,
      510.5650297412598,
    ],
    basemapLayers: {
      basemap: 'dark',
      labels: 'light',
      boundaries: false,
    },
    paramsConfig: {
      visualizationType: 'map',
      layer: '5de4d3c8-bd99-4fa2-99f2-5724275afd67',
    },
    we_meta: {
      core: '2.5.5',
      editor: '2.5.5',
      renderer: '2.5.5',
      adapter: 'rw-adapter',
      advanced: false,
    },
  },
  template: false,
  createdAt: '2020-12-30T16:14:55.364Z',
  updatedAt: '2021-01-04T18:10:56.375Z',
  metadata: [
    {
      id: '5feca77f22d275001a346fd3',
      type: 'metadata',
      attributes: {
        dataset: '1d23838e-40da-4cf3-b61c-56258d3a5c56',
        application: 'rw',
        resource: {
          id: '626ed7d7-efdd-4697-aee0-15ddb2f86d35',
          type: 'widget',
        },
        language: 'en',
        info: {
          caption: 'UNEP-WCMC/WorldFish Centre/WRI/TNC 2010',
          widgetLinks: [
            {
              link: 'https://resourcewatch.org/data/explore/1d23838e-40da-4cf3-b61c-56258d3a5c56?section=Discover&zoom=3.1011085755997105&lat=-11.79369419962359&lng=142.31760594484487&pitch=0&bearing=0&basemap=dark&labels=light&layers=%255B%257B%2522dataset%2522%253A%25221d23838e-40da-4cf3-b61c-56258d3a5c56%2522%252C%2522opacity%2522%253A1%252C%2522layer%2522%253A%25225de4d3c8-bd99-4fa2-99f2-5724275afd67%2522%257D%255D&page=1&sort=most-viewed&sortDirection=-1',
              name: 'View on Resource Watch',
            },
            {
              link: 'https://data.unep-wcmc.org/datasets/1',
              name: 'United Nations',
            },
          ],
        },
        createdAt: '2020-12-30T16:14:55.625Z',
        updatedAt: '2021-01-04T18:10:57.523Z',
        status: 'published',
      },
    },
  ],
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
                [
                  -12.093761259,
                  44.552460756,
                ],
                [
                  -14.106357807,
                  35.660331733,
                ],
                [
                  17.065486395,
                  35.126167008,
                ],
                [
                  17.814359529,
                  47.540103435,
                ],
                [
                  -12.093761259,
                  44.552460756,
                ],
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
  bbox: [
    -14.106357807,
    35.126167008,
    17.814359529,
    47.540103435,
  ],
};

Default.args = {
  widget,
  layerGroups: [
    {
      id: '4919be3a-c543-4964-a224-83ef801370de',
      opacity: 1,
      visibility: true,
      layers: [
        {
          id: '00e688a8-086e-4206-9ea7-b47afca6913c',
          name: 'Countries Experiencing Disaster Events',
          slug: 'Disaster-Events-in-the-News-Points',
          dataset: '4919be3a-c543-4964-a224-83ef801370de',
          description: 'Countries experiencing ongoing disasters that are actively being monitored by ReliefWeb. Each point is located in the center of a particular country and does not indicate where in that country the disaster occurred. The types of disasters being monitored include floods, droughts, severe local storms, tropical cyclones, storm surges, tsunamis, earthquakes, wildfires, cold waves, heat waves, volcanic activity, landslides, mudslides, snow avalanches, epidemics, insect infestations, and technological disasters.',
          application: [
            'rw',
          ],
          iso: [],
          provider: 'cartodb',
          type: 'layer',
          userId: '5ba001878e311b7e3718740f',
          default: true,
          active: true,
          opacity: 1,
          protected: false,
          published: true,
          env: 'production',
          layerConfig: {
            account: 'rw-nrt',
            body: {
              maxzoom: 18,
              minzoom: 0,
              layers: [
                {
                  type: 'mapnik',
                  options: {
                    sql: 'SELECT * FROM dis_006_reliefweb_disasters_interaction',
                    cartocss: '#dis_006_reliefweb_disasters_interaction  {::halo { marker-width: 20; marker-fill-opacity: 0.2;marker-fill:#FFF; marker-line-color: #FFF; marker-line-width: 0; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-allow-overlap: true; } marker-fill-opacity: 1; marker-line-width: 0.3 ; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-allow-overlap: true; marker-fill:#42f4f1; marker-line-color: #42f4f1; marker-width: 8;}',
                    cartocss_version: '2.3.0',
                  },
                },
              ],
              vectorLayers: [
                {
                  paint: {
                    'circle-color': '#42f4f1',
                    'circle-stroke-width': [
                      'interpolate',
                      [
                        'linear',
                      ],
                      [
                        'zoom',
                      ],
                      0,
                      2,
                      3,
                      6,
                      12,
                      15,
                    ],
                    'circle-stroke-color': '#fff',
                    'circle-opacity': 0.9,
                    'circle-stroke-opacity': 0.3,
                    'circle-radius': [
                      'interpolate',
                      [
                        'linear',
                      ],
                      [
                        'zoom',
                      ],
                      0,
                      3,
                      3,
                      10,
                      12,
                      30,
                    ],
                  },
                  'source-layer': 'layer0',
                  type: 'circle',
                  filter: [
                    'all',
                  ],
                },
              ],
            },
            layerType: 'vector',
          },
          legendConfig: {
            type: 'basic',
            items: [
              {
                name: 'Country with Current Disaster',
                color: '#42f4f1',
                id: 0,
              },
            ],
          },
          interactionConfig: {
            output: [
              {
                column: 'country_name',
                format: null,
                prefix: '',
                property: 'Country',
                suffix: '',
                type: 'string',
              },
              {
                column: 'interaction',
                format: null,
                prefix: '',
                property: 'Current Events (link to description)',
                suffix: '',
              },
            ],
          },
          applicationConfig: {},
          staticImageConfig: {},
          createdAt: '2019-11-12T19:59:28.596Z',
          updatedAt: '2020-05-17T22:17:29.089Z',
        },
      ],
    },
  ],
};

WithAreaOfInterest.args = {
  widget,
  aoiLayer,
};

WithMultipleLayers.args = {
  widget: {
    ...widget,
    widgetConfig: {
      ...widget.widgetConfig,
      layers: [
        '2a694289-fec9-4bfe-a6d2-56c3864ec349',
        '155968b5-7c59-4065-9e3a-0a81d52d50de',
        '00e688a8-086e-4206-9ea7-b47afca6913c',
        '7890b4f2-502a-408b-8614-3f00e0b53ec2',
      ],
    },
  },
  layerGroups: [
    {
      id: 'a86d906d-9862-4783-9e30-cdb68cd808b8',
      opacity: 1,
      visibility: true,
      layers: [
        {
          id: '2a694289-fec9-4bfe-a6d2-56c3864ec349',
          name: 'Power Plants by Capacity (MW) and Fuel Type',
          slug: 'Capacity-MW',
          dataset: 'a86d906d-9862-4783-9e30-cdb68cd808b8',
          description: 'Global power plants by capacity in megawatts and fuel type. Includes coal, oil, gas, hydro, nuclear, solar, waste, wind, geothermal, and biomass.',
          application: [
            'rw',
          ],
          iso: [],
          provider: 'cartodb',
          type: 'layer',
          userId: '5980838ae24e6a1dae3dd446',
          default: true,
          active: true,
          opacity: 1,
          protected: false,
          published: true,
          env: 'production',
          layerConfig: {
            body: {
              layers: [
                {
                  options: {
                    cartocss_version: '2.3.0',
                    cartocss: "#powerwatch_data_20180102 { marker-line-width:0.3; marker-line-color:#FFF; marker-allow-overlap: true; marker-line-opacity:0;}[capacity_mw <= 1500] {marker-fill-opacity: 0.6;}[capacity_mw > 1500] {marker-fill-opacity: 0.8;} [capacity_mw > 1500]{marker-width: 12.0+8.0*[capacity_mw]/22500.0;} [capacity_mw <= 1500]{marker-width: 4.0+8.0*[capacity_mw]/1500.0;} [primary_fuel='Coal']{marker-fill:#000000;}[primary_fuel='Oil']{marker-fill:#B15928;}[primary_fuel='Gas']{marker-fill:#BC80BD;}[primary_fuel='Hydro']{marker-fill:#1F78B4;}[primary_fuel='Nuclear']{marker-fill:#E31A1C;}[primary_fuel='Solar']{marker-fill:#FF7F00;}[primary_fuel='Waste']{marker-fill:#6A3D9A;}[primary_fuel='Wind']{marker-fill:#5CA2D1;}[primary_fuel='Geothermal']{marker-fill:#FDBF6F;}[primary_fuel='Biomass']{marker-fill:#229A00;}[primary_fuel='Others']{marker-fill:#B2DF8A;} [capacity_mw>=9000]{marker-width:10;}",
                    sql: 'SELECT * FROM powerwatch_data_20180102',
                  },
                  type: 'mapnik',
                },
              ],
              maxzoom: 18,
              vectorLayers: [
                {
                  paint: {
                    'circle-color': [
                      'match',
                      [
                        'get',
                        'primary_fuel',
                      ],
                      'Coal',
                      '#000',
                      'Oil',
                      '#B15928',
                      'Gas',
                      '#BC80BD',
                      'Hydro',
                      '#1F78B4',
                      'Nuclear',
                      '#E31A1C',
                      'Solar',
                      '#FF7F00',
                      'Waste',
                      '#6A3D9A',
                      'Wind',
                      '#5CA2D1',
                      'Geothermal',
                      '#FDBF6F',
                      'Biomass',
                      '#229A00',
                      'Others',
                      '#B2DF8A',
                      '#B2DF8A',
                    ],
                    'circle-stroke-width': 0.2,
                    'circle-stroke-color': '#FFF',
                    'circle-opacity': 0.9,
                    'circle-stroke-opacity': 0.5,
                    'circle-radius': [
                      'interpolate',
                      [
                        'linear',
                      ],
                      [
                        'zoom',
                      ],
                      0,
                      [
                        '+',
                        0.1,
                        [
                          '/',
                          [
                            'sqrt',
                            [
                              '/',
                              [
                                'get',
                                'capacity_mw',
                              ],
                              [
                                'pi',
                              ],
                            ],
                          ],
                          20,
                        ],
                      ],
                      12,
                      [
                        '+',
                        4,
                        [
                          '/',
                          [
                            'sqrt',
                            [
                              '/',
                              [
                                'get',
                                'capacity_mw',
                              ],
                              [
                                'pi',
                              ],
                            ],
                          ],
                          3,
                        ],
                      ],
                    ],
                  },
                  'source-layer': 'layer0',
                  type: 'circle',
                  layout: {
                    'circle-sort-key': [
                      'get',
                      'capacity_mw',
                    ],
                  },
                  filter: [
                    'all',
                  ],
                },
              ],
            },
            account: 'wri-rw',
            layerType: 'vector',
          },
          legendConfig: {
            items: [
              {
                color: '#000000',
                name: 'Coal',
                id: 0,
              },
              {
                color: '#B15928',
                name: 'Oil',
                id: 1,
              },
              {
                color: '#BC80BD',
                name: 'Gas',
                id: 2,
              },
              {
                color: '#1F78B4',
                name: 'Hydro',
                id: 3,
              },
              {
                color: '#E31A1C',
                name: 'Nuclear',
                id: 4,
              },
              {
                color: '#FF7F00',
                name: 'Solar',
                id: 5,
              },
              {
                color: '#6A3D9A',
                name: 'Waste',
                id: 6,
              },
              {
                color: '#5CA2D1',
                name: 'Wind',
                id: 7,
              },
              {
                color: '#FDBF6F',
                name: 'Geothermal',
                id: 8,
              },
              {
                color: '#229A00',
                name: 'Biomass',
                id: 9,
              },
              {
                color: '#B2DF8A',
                name: 'Others',
                id: 10,
              },
            ],
            type: 'basic',
          },
          interactionConfig: {
            output: [
              {
                column: 'country_long',
                format: null,
                prefix: '',
                property: 'Country',
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
                column: 'primary_fuel',
                format: null,
                prefix: '',
                property: 'Fuel Type',
                suffix: '',
                type: 'string',
              },
              {
                column: 'owner',
                format: null,
                prefix: '',
                property: 'Owner',
                suffix: '',
                type: 'string',
              },
              {
                column: 'capacity_mw',
                format: null,
                prefix: '',
                property: 'Capacity',
                suffix: ' MW',
                type: 'number',
              },
              {
                column: 'source',
                format: null,
                prefix: '',
                property: 'Data Source',
                suffix: '',
                type: 'string',
              },
              {
                column: 'generation_gwh_2018',
                format: null,
                prefix: '',
                property: 'Reported Generation (2018)',
                suffix: ' GWh',
                type: 'number',
              },
              {
                column: 'estimated_generation_gwh_2017',
                format: null,
                prefix: '',
                property: 'Estimated Generation (2017)',
                suffix: ' GWh',
                type: 'number',
              },
            ],
          },
          applicationConfig: {},
          staticImageConfig: {},
          createdAt: '2019-09-24T21:00:44.622Z',
          updatedAt: '2021-06-08T11:57:53.571Z',
        },
        {
          id: '155968b5-7c59-4065-9e3a-0a81d52d50de',
          name: 'Power Plants by Fuel Type',
          slug: 'Fuel-Type',
          dataset: 'a86d906d-9862-4783-9e30-cdb68cd808b8',
          description: 'Global power plants by fuel type. Includes coal, oil, gas, hydro, nuclear, solar, waste, wind, geothermal, and biomass.',
          application: [
            'rw',
          ],
          iso: [],
          provider: 'cartodb',
          type: 'layer',
          userId: '5980838ae24e6a1dae3dd446',
          default: false,
          active: false,
          opacity: 1,
          protected: false,
          published: true,
          env: 'production',
          layerConfig: {
            account: 'wri-rw',
            body: {
              maxzoom: 18,
              minzoom: 3,
              layers: [
                {
                  type: 'mapnik',
                  options: {
                    sql: 'SELECT * FROM powerwatch_data_20180102',
                    cartocss: "#powerwatch_data_20180102 {marker-fill-opacity:1; marker-width:3; marker-line-width:0.3; marker-line-color:#FFF; marker-allow-overlap: true; marker-line-opacity:0;[zoom > 2] {marker-width: 3;} [zoom > 3] {marker-width: 4;}[zoom > 5] {marker-width: 7;} [zoom > 7] {marker-width: 12;} [zoom > 9] {marker-width: 15;}} [primary_fuel='Coal']{marker-fill:#000000;}[primary_fuel='Oil']{marker-fill:#B15928;}[primary_fuel='Gas']{marker-fill:#BC80BD;}[primary_fuel='Hydro']{marker-fill:#1F78B4;}[primary_fuel='Nuclear']{marker-fill:#E31A1C;}[primary_fuel='Solar']{marker-fill:#FF7F00;}[primary_fuel='Waste']{marker-fill:#6A3D9A;}[primary_fuel='Wind']{marker-fill:#5CA2D1;}[primary_fuel='Geothermal']{marker-fill:#FDBF6F;}[primary_fuel='Biomass']{marker-fill:#229A00;}[primary_fuel='Others']{marker-fill:#B2DF8A;}",
                    cartocss_version: '2.3.0',
                  },
                },
              ],
              vectorLayers: [
                {
                  paint: {
                    'circle-opacity': 1,
                    'circle-radius': 3,
                    'circle-stroke-width': 0.3,
                    'circle-stroke-color': '#FFF',
                    'circle-stroke-opacity': 0,
                  },
                  'source-layer': 'layer0',
                  type: 'circle',
                  filter: [
                    'all',
                    [
                      '>',
                      'zoom ',
                      2,
                    ],
                  ],
                },
                {
                  paint: {
                    'circle-radius': 4,
                  },
                  'source-layer': 'layer0',
                  type: 'circle',
                  filter: [
                    'all',
                    [
                      '>',
                      'zoom ',
                      3,
                    ],
                  ],
                },
                {
                  paint: {
                    'circle-radius': 7,
                  },
                  'source-layer': 'layer0',
                  type: 'circle',
                  filter: [
                    'all',
                    [
                      '>',
                      'zoom ',
                      5,
                    ],
                  ],
                },
                {
                  paint: {
                    'circle-radius': 12,
                  },
                  'source-layer': 'layer0',
                  type: 'circle',
                  filter: [
                    'all',
                    [
                      '>',
                      'zoom ',
                      7,
                    ],
                  ],
                },
                {
                  paint: {
                    'circle-radius': 15,
                  },
                  'source-layer': 'layer0',
                  type: 'circle',
                  filter: [
                    'all',
                    [
                      '>',
                      'zoom ',
                      9,
                    ],
                  ],
                },
                {
                  paint: {
                    'circle-color': '#000000',
                  },
                  'source-layer': 'layer0',
                  type: 'circle',
                  filter: [
                    'all',
                    [
                      '==',
                      'primary_fuel',
                      'Coal',
                    ],
                  ],
                },
                {
                  paint: {
                    'circle-color': '#B15928',
                  },
                  'source-layer': 'layer0',
                  type: 'circle',
                  filter: [
                    'all',
                    [
                      '==',
                      'primary_fuel',
                      'Oil',
                    ],
                  ],
                },
                {
                  paint: {
                    'circle-color': '#BC80BD',
                  },
                  'source-layer': 'layer0',
                  type: 'circle',
                  filter: [
                    'all',
                    [
                      '==',
                      'primary_fuel',
                      'Gas',
                    ],
                  ],
                },
                {
                  paint: {
                    'circle-color': '#1F78B4',
                  },
                  'source-layer': 'layer0',
                  type: 'circle',
                  filter: [
                    'all',
                    [
                      '==',
                      'primary_fuel',
                      'Hydro',
                    ],
                  ],
                },
                {
                  paint: {
                    'circle-color': '#E31A1C',
                  },
                  'source-layer': 'layer0',
                  type: 'circle',
                  filter: [
                    'all',
                    [
                      '==',
                      'primary_fuel',
                      'Nuclear',
                    ],
                  ],
                },
                {
                  paint: {
                    'circle-color': '#FF7F00',
                  },
                  'source-layer': 'layer0',
                  type: 'circle',
                  filter: [
                    'all',
                    [
                      '==',
                      'primary_fuel',
                      'Solar',
                    ],
                  ],
                },
                {
                  paint: {
                    'circle-color': '#6A3D9A',
                  },
                  'source-layer': 'layer0',
                  type: 'circle',
                  filter: [
                    'all',
                    [
                      '==',
                      'primary_fuel',
                      'Waste',
                    ],
                  ],
                },
                {
                  paint: {
                    'circle-color': '#5CA2D1',
                  },
                  'source-layer': 'layer0',
                  type: 'circle',
                  filter: [
                    'all',
                    [
                      '==',
                      'primary_fuel',
                      'Wind',
                    ],
                  ],
                },
                {
                  paint: {
                    'circle-color': '#FDBF6F',
                  },
                  'source-layer': 'layer0',
                  type: 'circle',
                  filter: [
                    'all',
                    [
                      '==',
                      'primary_fuel',
                      'Geothermal',
                    ],
                  ],
                },
                {
                  paint: {
                    'circle-color': '#229A00',
                  },
                  'source-layer': 'layer0',
                  type: 'circle',
                  filter: [
                    'all',
                    [
                      '==',
                      'primary_fuel',
                      'Biomass',
                    ],
                  ],
                },
                {
                  paint: {
                    'circle-color': '#B2DF8A',
                  },
                  'source-layer': 'layer0',
                  type: 'circle',
                  filter: [
                    'all',
                    [
                      '==',
                      'primary_fuel',
                      'Others',
                    ],
                  ],
                },
              ],
            },
            layerType: 'vector',
          },
          legendConfig: {
            items: [
              {
                color: '#000000',
                name: 'Coal',
                id: 0,
              },
              {
                color: '#B15928',
                name: 'Oil',
                id: 1,
              },
              {
                color: '#BC80BD',
                name: 'Gas',
                id: 2,
              },
              {
                color: '#1F78B4',
                name: 'Hydro',
                id: 3,
              },
              {
                color: '#E31A1C',
                name: 'Nuclear',
                id: 4,
              },
              {
                color: '#FF7F00',
                name: 'Solar',
                id: 5,
              },
              {
                color: '#6A3D9A',
                name: 'Waste',
                id: 6,
              },
              {
                color: '#5CA2D1',
                name: 'Wind',
                id: 7,
              },
              {
                color: '#FDBF6F',
                name: 'Geothermal',
                id: 8,
              },
              {
                color: '#229A00',
                name: 'Biomass',
                id: 9,
              },
              {
                color: '#B2DF8A',
                name: 'Others',
                id: 10,
              },
            ],
            type: 'basic',
          },
          interactionConfig: {
            output: [
              {
                column: 'country_long',
                format: null,
                prefix: '',
                property: 'Country',
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
                column: 'owner',
                format: null,
                prefix: '',
                property: 'Owner',
                suffix: '',
                type: 'string',
              },
              {
                column: 'primary_fuel',
                format: null,
                prefix: '',
                property: 'Fuel Type',
                suffix: '',
                type: 'string',
              },
              {
                column: 'capacity_mw',
                format: null,
                prefix: '',
                property: 'Capacity',
                suffix: ' MW',
                type: 'number',
              },
              {
                column: 'source',
                format: null,
                prefix: '',
                property: 'Data Source',
                suffix: '',
                type: 'string',
              },
              {
                column: 'generation_gwh_2018',
                format: null,
                prefix: '',
                property: 'Reported Generation (2018)',
                suffix: ' GWh',
                type: 'number',
              },
              {
                column: 'estimated_generation_gwh_2017',
                format: null,
                prefix: '',
                property: 'Estimated Generation (2017)',
                suffix: ' GWh',
                type: 'number',
              },
            ],
          },
          applicationConfig: {},
          staticImageConfig: {},
          createdAt: '2019-09-24T21:00:45.071Z',
          updatedAt: '2021-06-08T12:02:27.343Z',
        },
      ],
    },
    {
      id: 'fe9b286f-4b28-409a-85f5-2e81b2bd5056',
      opacity: 1,
      visibility: true,
      layers: [
        {
          id: '7890b4f2-502a-408b-8614-3f00e0b53ec2',
          name: 'Adaptation Capacity to Reef Loss',
          slug: 'Adaptation-Capacity-to-Reef-Loss_6',
          dataset: 'fe9b286f-4b28-409a-85f5-2e81b2bd5056',
          description: 'An adaptive capacity index to reef loss based on the following inputs: economic resources, education, health (life expectancy), governance, access to markets, and agricultural resources',
          application: [
            'rw',
          ],
          iso: [],
          provider: 'cartodb',
          type: 'layer',
          userId: '5ba001878e311b7e3718740f',
          default: false,
          active: true,
          opacity: 1,
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
                    sql: 'SELECT * FROM bio_031_soc_econ_reef',
                    cartocss: "#bio_031_soc_econ_reef{polygon-opacity: 0.5; line-width: 0.5; line-color:#bdbdbd; line-opacity: 1;}  #bio_031_soc_econ_reef [adapt_cat = 'High' ] {polygon-fill: #a6d96a; } #bio_031_soc_econ_reef [adapt_cat = 'Medium'] {polygon-fill: #ffffbf; } #bio_031_soc_econ_reef [adapt_cat = 'Low'] {polygon-fill: #fdae61;} #bio_031_soc_econ_reef [adapt_cat = 'Very low'] {polygon-fill: #d7191c;}",
                    cartocss_version: '2.3.0',
                  },
                },
              ],
              vectorLayers: [
                {
                  paint: {
                    'line-width': 0.5,
                    'line-opacity': 1,
                    'line-color': '#bdbdbd',
                  },
                  'source-layer': 'layer0',
                  type: 'line',
                  filter: [
                    'all',
                  ],
                },
                {
                  paint: {
                    'fill-color': '#d7191c',
                    'fill-opacity': 0.5,
                  },
                  'source-layer': 'layer0',
                  type: 'fill',
                  filter: [
                    'all',
                    [
                      '==',
                      'adapt_cat',
                      'Very low',
                    ],
                  ],
                },
                {
                  paint: {
                    'fill-color': '#fdae61',
                    'fill-opacity': 0.5,
                  },
                  'source-layer': 'layer0',
                  type: 'fill',
                  filter: [
                    'all',
                    [
                      '==',
                      'adapt_cat',
                      'Low',
                    ],
                  ],
                },
                {
                  paint: {
                    'fill-color': '#ffffbf',
                    'fill-opacity': 0.5,
                  },
                  'source-layer': 'layer0',
                  type: 'fill',
                  filter: [
                    'all',
                    [
                      '==',
                      'adapt_cat',
                      'Medium',
                    ],
                  ],
                },
                {
                  paint: {
                    'fill-color': '#a6d96a',
                    'fill-opacity': 0.5,
                  },
                  'source-layer': 'layer0',
                  type: 'fill',
                  filter: [
                    'all',
                    [
                      '==',
                      'adapt_cat',
                      'High',
                    ],
                  ],
                },
              ],
            },
            layerType: 'vector',
          },
          legendConfig: {
            type: 'choropleth',
            items: [
              {
                name: 'High',
                color: '#a6d96a',
                id: 0,
              },
              {
                name: 'Medium',
                color: '#ffffbf',
                id: 1,
              },
              {
                name: 'Low',
                color: '#fdae61',
                id: 2,
              },
              {
                name: 'Very Low',
                color: '#d7191c',
                id: 3,
              },
            ],
          },
          interactionConfig: {
            output: [
              {
                column: 'country',
                format: null,
                prefix: '',
                property: 'Country',
                suffix: '',
                type: 'string',
              },
              {
                column: 'adapt_cat',
                format: null,
                prefix: '',
                property: 'Adaptation Capacity to Reef Loss',
                suffix: '',
                type: 'string',
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
          createdAt: '2019-10-23T16:01:02.540Z',
          updatedAt: '2020-05-15T21:05:24.346Z',
        },
      ],
    },
    {
      id: '4919be3a-c543-4964-a224-83ef801370de',
      opacity: 1,
      visibility: true,
      layers: [
        {
          id: '00e688a8-086e-4206-9ea7-b47afca6913c',
          name: 'Countries Experiencing Disaster Events',
          slug: 'Disaster-Events-in-the-News-Points',
          dataset: '4919be3a-c543-4964-a224-83ef801370de',
          description: 'Countries experiencing ongoing disasters that are actively being monitored by ReliefWeb. Each point is located in the center of a particular country and does not indicate where in that country the disaster occurred. The types of disasters being monitored include floods, droughts, severe local storms, tropical cyclones, storm surges, tsunamis, earthquakes, wildfires, cold waves, heat waves, volcanic activity, landslides, mudslides, snow avalanches, epidemics, insect infestations, and technological disasters.',
          application: [
            'rw',
          ],
          iso: [],
          provider: 'cartodb',
          type: 'layer',
          userId: '5ba001878e311b7e3718740f',
          default: true,
          active: true,
          opacity: 1,
          protected: false,
          published: true,
          env: 'production',
          layerConfig: {
            account: 'rw-nrt',
            body: {
              maxzoom: 18,
              minzoom: 0,
              layers: [
                {
                  type: 'mapnik',
                  options: {
                    sql: 'SELECT * FROM dis_006_reliefweb_disasters_interaction',
                    cartocss: '#dis_006_reliefweb_disasters_interaction  {::halo { marker-width: 20; marker-fill-opacity: 0.2;marker-fill:#FFF; marker-line-color: #FFF; marker-line-width: 0; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-allow-overlap: true; } marker-fill-opacity: 1; marker-line-width: 0.3 ; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-allow-overlap: true; marker-fill:#42f4f1; marker-line-color: #42f4f1; marker-width: 8;}',
                    cartocss_version: '2.3.0',
                  },
                },
              ],
              vectorLayers: [
                {
                  paint: {
                    'circle-color': '#42f4f1',
                    'circle-stroke-width': [
                      'interpolate',
                      [
                        'linear',
                      ],
                      [
                        'zoom',
                      ],
                      0,
                      2,
                      3,
                      6,
                      12,
                      15,
                    ],
                    'circle-stroke-color': '#fff',
                    'circle-opacity': 0.9,
                    'circle-stroke-opacity': 0.3,
                    'circle-radius': [
                      'interpolate',
                      [
                        'linear',
                      ],
                      [
                        'zoom',
                      ],
                      0,
                      3,
                      3,
                      10,
                      12,
                      30,
                    ],
                  },
                  'source-layer': 'layer0',
                  type: 'circle',
                  filter: [
                    'all',
                  ],
                },
              ],
            },
            layerType: 'vector',
          },
          legendConfig: {
            type: 'basic',
            items: [
              {
                name: 'Country with Current Disaster',
                color: '#42f4f1',
                id: 0,
              },
            ],
          },
          interactionConfig: {
            output: [
              {
                column: 'country_name',
                format: null,
                prefix: '',
                property: 'Country',
                suffix: '',
                type: 'string',
              },
              {
                column: 'interaction',
                format: null,
                prefix: '',
                property: 'Current Events (link to description)',
                suffix: '',
              },
            ],
          },
          applicationConfig: {},
          staticImageConfig: {},
          createdAt: '2019-11-12T19:59:28.596Z',
          updatedAt: '2020-05-17T22:17:29.089Z',
        },
      ],
    },
  ],
  aoiLayer,
};
