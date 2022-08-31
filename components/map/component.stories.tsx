import { Story } from '@storybook/react/types-6-0';
import { useMemo } from 'react';

// components
import { LayerManager, Layer } from '@vizzuality/layer-manager-react';
import PluginMapboxGl from '@vizzuality/layer-manager-plugin-mapboxgl';
import Map from './component';

import { parseDeckLayer } from 'components/map/layer-manager/utils';

export default {
  title: 'Map',
  component: Map,
  parameters: {
    controls: {
      include: ['labels', 'basemap', 'tileUrl', 'decodeFunction', 'decodeParams', 'layerConfig'],
      sort: 'requiredFirst',
    },
  },
  argTypes: {
    tileUrl: {
      name: 'tileUrl',
      type: { name: 'Tile URL', required: true },
      defaultValue:
        'https://tiles.globalforestwatch.org/tsc_tree_cover_loss_drivers/v2020/tcd_30/{z}/{x}/{y}.png',
      control: {
        type: 'text',
      },
    },
    labels: {
      defaultValue: 'light',
    },
    basemap: {
      defaultValue: 'dark',
    },
    decodeParams: {
      name: 'decodeParams',
      type: { name: 'object', required: true },
      defaultValue: {
        startYear: 2001,
        endYear: 2017,
      },
    },
    decodeFunction: {
      name: 'decodeFunction',
      type: { name: 'string', required: true },
      defaultValue: `
        float year = 2000.0 + (color.b * 255.);
        // map to years
        if (year >= startYear && year <= endYear && year >= 2001.) {
          // values for creating power scale, domain (input), and range (output)
          float domainMin = 0.;
          float domainMax = 255.;
          float rangeMin = 0.;
          float rangeMax = 255.;
          float exponent = zoom < 13. ? 0.3 + (zoom - 3.) / 20. : 1.;
          float intensity = color.r * 255.;
          // get the min, max, and current values on the power scale
          float minPow = pow(domainMin, exponent - domainMin);
          float maxPow = pow(domainMax, exponent);
          float currentPow = pow(intensity, exponent);
          // get intensity value mapped to range
          float scaleIntensity = ((currentPow - minPow) / (maxPow - minPow) * (rangeMax - rangeMin)) + rangeMin;
          // a value between 0 and 255
          alpha = scaleIntensity * 2. / 255.;
          float lossCat = color.g * 255.;
          float r = 255.;
          float g = 255.;
          float b = 255.;
          if (lossCat == 1.) {
            r = 244.;
            g = 29.;
            b = 54.;
          } else if (lossCat == 2.) {
            r = 239.;
            g = 211.;
            b = 26.;
          } else if (lossCat == 3.) {
            r = 47.;
            g = 191.;
            b = 113.;
          } else if (lossCat == 4.) {
            r = 173.;
            g = 104.;
            b = 36.;
          } else if (lossCat == 5.) {
            r = 178.;
            g = 53.;
            b = 204.;
          }
          color.r = r / 255.;
          color.g = g / 255.;
          color.b = b / 255.;
        } else {
          alpha = 0.;
        }
    `,
      description: 'The decode function you will apply to each tile pixel',
      control: {
        type: 'text',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full h-screen">
        <Story />
      </div>
    ),
  ],
};

const Template: Story = (args) => {
  const { layerConfig, decodeFunction, decodeParams, tileUrl, ...mapArgs } = args;

  const layer = useMemo(() => {
    return {
      id: args.id,
      type: args.type,
      ...layerConfig,
      deck: [
        {
          ...layerConfig.deck[0],
          decodeFunction,
          decodeParams,
          tileUrl,
        },
      ],
    };
  }, [decodeFunction, decodeParams, tileUrl, args, layerConfig]);

  // * After any update, a new layer will be created but the old one will be kept.
  // * In order to update the current one, updates are made through the setProps method.
  // * To avoid this, the parse is only triggered once.
  // ! do not add any dependencies to the useMemo unless you know what you are doing.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const DECK_LAYERS = useMemo(() => parseDeckLayer(layer), []);

  // useEffect(() => {
  //   const [layer] = DECK_LAYERS;
  //   if (layer && typeof layer.setProps === 'function') {
  //     layer.setProps({
  //       decodeParams,
  //       decodeFunction,
  //       data: tileUrl,
  //     });
  //   }
  // }, [decodeParams, decodeFunction, DECK_LAYERS, tileUrl]);

  return (
    <Map {...mapArgs}>
      {(_map) => (
        <LayerManager map={_map} plugin={PluginMapboxGl}>
          <Layer {...args} type="deck" deck={DECK_LAYERS} />
        </LayerManager>
      )}
    </Map>
  );
};

export const WithDecodedRasterLayer = Template.bind({});

WithDecodedRasterLayer.args = {
  id: 'mosaic-land-cover-and-land-use-2020',
  layerConfig: {
    type: 'deck',
    deck: [
      {
        type: 'TileLayer',
        params: {
          decodeFunction: `
          float year = 2000.0 + (color.b * 255.);
          // map to years
          if (year >= startYear && year <= endYear && year >= 2001.) {
            // values for creating power scale, domain (input), and range (output)
            float domainMin = 0.;
            float domainMax = 255.;
            float rangeMin = 0.;
            float rangeMax = 255.;
            float exponent = zoom < 13. ? 0.3 + (zoom - 3.) / 20. : 1.;
            float intensity = color.r * 255.;
            // get the min, max, and current values on the power scale
            float minPow = pow(domainMin, exponent - domainMin);
            float maxPow = pow(domainMax, exponent);
            float currentPow = pow(intensity, exponent);
            // get intensity value mapped to range
            float scaleIntensity = ((currentPow - minPow) / (maxPow - minPow) * (rangeMax - rangeMin)) + rangeMin;
            // a value between 0 and 255
            alpha = scaleIntensity * 2. / 255.;
            float lossCat = color.g * 255.;
            float r = 255.;
            float g = 255.;
            float b = 255.;
            if (lossCat == 1.) {
              r = 244.;
              g = 29.;
              b = 54.;
            } else if (lossCat == 2.) {
              r = 239.;
              g = 211.;
              b = 26.;
            } else if (lossCat == 3.) {
              r = 47.;
              g = 191.;
              b = 113.;
            } else if (lossCat == 4.) {
              r = 173.;
              g = 104.;
              b = 36.;
            } else if (lossCat == 5.) {
              r = 178.;
              g = 53.;
              b = 204.;
            }
            color.r = r / 255.;
            color.g = g / 255.;
            color.b = b / 255.;
          } else {
            alpha = 0.;
          }
      `,
          decodeParams: {
            startYear: 2001,
            endYear: 2017,
          },
          minZoom: 3,
          maxZoom: 12,
        },
        data: 'https://tiles.globalforestwatch.org/tsc_tree_cover_loss_drivers/v2020/tcd_30/{z}/{x}/{y}.png',
        subtype: 'DecodedRasterLayer',
      },
    ],
  },
};
