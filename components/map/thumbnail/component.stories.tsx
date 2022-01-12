import { ErrorBoundary } from 'react-error-boundary';

// components
import ErrorFallback from 'components/error-fallback';
import MapThumbnail from './component';

const CustomErrorFallback = (_props) => (
  <ErrorFallback {..._props} title="Something went wrong with the preview" />
);

export default {
  title: 'Map/Thumbnail',
  component: MapThumbnail,
  argTypes: {},
  decorators: [
    (Story) => (
      <div className="flex justify-center">
        <div
          style={{
            width: 390,
            height: 130,
          }}
        >
          <ErrorBoundary FallbackComponent={CustomErrorFallback}>
            <Story />
          </ErrorBoundary>
        </div>
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
      <MapThumbnail basemap={args.basemap} layer={args.layer} />
    </>
  );
}

export const Default = Template.bind({});

Default.args = {
  layer: {
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
    applicationConfig: {},
    staticImageConfig: {},
    createdAt: '2020-02-24T15:34:09.069Z',
    updatedAt: '2022-01-11T11:42:22.794Z',
  },
  basemap: 'aqueduct',
};
