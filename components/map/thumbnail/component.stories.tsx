// components
import MapThumbnail from './component';

import type { APILayerSpec } from 'types/layer';

export default {
  title: 'Map/Thumbnail',
  component: MapThumbnail,
  argTypes: {},
  decorators: [
    (Story) => (
      <div className="flex justify-center">
        <Story />
      </div>
    ),
  ],
};

function triggerError() {
  throw new Error('this is an sample error');
}

function Template(args) {
  return (
    <>
      {args.isError && triggerError()}
      <div
        style={{
          width: 256,
          height: 256,
        }}
      >
        <MapThumbnail layer={args.layer} />
      </div>
    </>
  );
}

export const WithLayerPreview = Template.bind({});
export const WithPlaceholder = Template.bind({});

const layer: APILayerSpec = {
  id: '0bb499a3-3a09-4461-a8d6-295b8491cd5a',
  name: 'Average Daily Global Horizontal Irradiation (kWh/m²)',
  slug: 'Average-Daily-Global-Horizontal-Irradiation-kWhm_1',
  dataset: '2063964b-56c8-4080-b2a5-5a7710f321b9',
  description: 'The daily average rate of horizontal irradiation received around the world.',
  application: ['rw'],
  iso: [],
  provider: 'gee',
  type: 'layer',
  userId: '5d0901197aabc0001072e40c',
  default: true,
  protected: false,
  published: true,
  env: 'production',
  thumbnailUrl:
    'https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/thumbnails/70bc182f-0e3d-42f4-8313-f6fc45416ffc-1642664432484.png',
  layerConfig: {
    type: 'raster',
    source: {
      provider: {
        type: 'gee',
        options: {},
      },
      type: 'raster',
      tiles: [],
      minzoom: 3,
      maxzoom: 12,
    },
  },
  legendConfig: {},
  interactionConfig: {},
  applicationConfig: {},
  staticImageConfig: {},
  createdAt: '2020-02-24T15:34:09.069Z',
  updatedAt: '2022-01-11T11:42:22.794Z',
};

WithLayerPreview.args = {
  layer,
};

WithPlaceholder.args = {
  layer: {
    ...layer,
    thumbnailUrl: '',
  },
};
